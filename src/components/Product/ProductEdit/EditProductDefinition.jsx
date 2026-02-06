import "../ProductDefinition/CreateProductDefinition.css";
import { electronicComponents } from "../ProductDefinition/electronicComponents";
import { useEffect, useState } from "react";
import { Formik, Field, Form, FieldArray, ErrorMessage } from "formik";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Center, Heading, Text, Button } from "@chakra-ui/react";
import Ellipse521 from "../../../images/Ellipse 521.svg";
import Footer from "../../Footer";
import { baseURL } from "../../../utilities";

const EditProductDefinition = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getStoredValues = () => {
    const storedValues = sessionStorage.getItem("productDefinition");
    if (storedValues) {
      return JSON.parse(storedValues);
    }

    if (location.state?.productID && location.state?.deviceName) {
      const newValues = {
        productID: location.state.productID,
        deviceName: location.state.deviceName,
      };
      sessionStorage.setItem("productDefinition", JSON.stringify(newValues));
      return newValues;
    }

    return {
      productID: "",
      deviceName: "",
    };
  };

  const [initialValues, setInitialValues] = useState({
    productID: getStoredValues().productID,
    deviceName: getStoredValues().deviceName,
    components: [],
  });

  const convertDataToAPIFormat = async (values) => {
    const formattedComponents = {};
    values.components.forEach((component) => {
      formattedComponents[component.componentName] = {
        ...component,
        type: component.componentType.toLowerCase(),
      };

      // Assign unit only if it exists
      if (Array.isArray(component.unit) && component.unit.length > 0) {
        formattedComponents[component.componentName].unit = component.unit[0]; // Take the first unit
      }

      delete formattedComponents[component.componentName].componentName;
      delete formattedComponents[component.componentName].componentType;
      if (formattedComponents[component.componentName].state === undefined) {
        delete formattedComponents[component.componentName].state;
      }
    });

    const resultData = {
      productID: values.productID,
      components: formattedComponents,
      deviceName: values.deviceName,
    };

    console.log("Result data:", resultData);

    try {
      const response = await axios.patch(
        `${baseURL}/product/${values.productID}/components`,
        resultData.components
      );
      console.log("Product definition successfully updated:", response.data);

      // Navigate to block diagram with state
      navigate("/blockdiagram", {
        state: {
          productID: values.productID,
          deviceName: values.deviceName,
        },
      });
    } catch (error) {
      console.error("Error sending data to the server:", error);
      alert("Error submitting form. Please try again.");
      throw error; // Re-throw to be caught by the form submission handler
    }
  };

  //   fetches and updates the form

  const fetchProductDefinition = async (productID) => {
    try {
      const response = await axios.get(
        `${baseURL}/product/${productID}/definitionNew`
      );

      const convertedComponents = convertDataFromApi(response.data);

      setInitialValues((prevValues) => ({
        ...prevValues,
        components: convertedComponents,
      }));
    } catch (error) {
      console.log("Error fetching product definition:", error);
    }
  };

  const convertDataFromApi = (apiData) => {
    if (!apiData || !apiData.components) return [];

    return Object.keys(apiData.components).map((componentName) => {
      const component = apiData.components[componentName];

      // Try to find a match in electronicComponents for type normalization
      let componentType = component.type || "";
      const match = electronicComponents.find(
        (c) => c.type.toLowerCase() === componentType.toLowerCase().trim()
      );
      if (match) {
        componentType = match.type;
      } else {
        if (componentType) {
          componentType = componentType.charAt(0).toUpperCase() + componentType.slice(1);
        }
      }

      let formattedComponent = {
        componentID: component.componentID || "",
        componentType,
        componentName,
        note: component.note || "",
        urls: Array.isArray(component.urls) ? component.urls : (component.urls ? [component.urls] : []),
      };

      // Ensure 'unit' is always an array if present
      if (component.unit) {
        formattedComponent.unit = Array.isArray(component.unit)
          ? component.unit
          : [component.unit];
      }

      // Only add min/max if they exist
      if (component.min !== undefined && component.max !== undefined) {
        formattedComponent.min = component.min;
        formattedComponent.max = component.max;
      }

      return formattedComponent;
    });
  };

  useEffect(() => {
    if (initialValues?.productID !== null) {
      fetchProductDefinition(initialValues.productID);
    }
  }, [initialValues?.productID]);

  useEffect(() => {
    const values = getStoredValues();
    setInitialValues({
      productID: values.productID,
      deviceName: values.deviceName,
      components: [],
    });
  }, [location.state]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("productDefinition");
    };
  }, []);

  return (
    <Box>
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <div className=" rounded p-4 border" style={{ width: "100%" }}>
          <h3 className="m-4 text-dark text-center">
            {initialValues.deviceName}
          </h3>

          <Formik
            initialValues={initialValues}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await convertDataToAPIFormat(values);
              } catch (error) {
                console.error("Form submission error:", error);
              } finally {
                setSubmitting(false);
              }
            }}
            enableReinitialize
          >
            {(formik) => (
              <Form onSubmit={formik.handleSubmit}>
                <FieldArray name="components">
                  {(helperMethod) => (
                    <div>
                      {formik.values.components?.map((component, index) => (
                        <div
                          key={index}
                          className="border p-3 mb-3 bg-light rounded"
                        >
                          <div>
                            <div className="form-floating mb-3">
                              <Field
                                type="text"
                                className="form-control"
                                name={`components[${index}].componentID`}
                                required
                              />
                              <label
                                htmlFor={`components[${index}].componentID`}
                              >
                                Component ID
                              </label>
                              <ErrorMessage
                                name={`components[${index}].componentID`}
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            <div className="form-floating mb-3">
                              <Field
                                as="select"
                                className="form-select"
                                name={`components[${index}].componentType`}
                                onChange={(e) => {
                                  formik.handleChange(e);
                                  helperMethod.replace(index, {
                                    ...component,
                                    componentType: e.target.value,
                                    componentName: "",
                                    unit: undefined,
                                    min: undefined,
                                    max: undefined,
                                  });
                                }}
                              >
                                <option value="" disabled>
                                  -- Select Component Type --
                                </option>
                                {/* Support custom/existing value */}
                                {component.componentType && !electronicComponents.some(c => c.type === component.componentType) && (
                                  <option value={component.componentType}>{component.componentType}</option>
                                )}
                                {electronicComponents.map((category, idx) => (
                                  <option key={idx} value={category.type}>
                                    {category.type}
                                  </option>
                                ))}
                              </Field>
                              <label
                                htmlFor={`components[${index}].componentType`}
                              >
                                Component Type
                              </label>
                              <ErrorMessage
                                name={`components[${index}].componentType`}
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            {component.componentType && (
                              <div className="form-floating mb-3">
                                <Field
                                  as="select"
                                  className="form-select"
                                  name={`components[${index}].componentName`}
                                  onChange={(e) => {
                                    formik.handleChange(e);
                                    const selectedComponent =
                                      electronicComponents
                                        .find(
                                          (cat) =>
                                            cat.type === component.componentType
                                        )
                                        ?.components.find(
                                          (comp) => comp.name === e.target.value
                                        );

                                    helperMethod.replace(index, {
                                      ...component,
                                      componentName: e.target.value,
                                      unit:
                                        selectedComponent?.unit || undefined,
                                      min: selectedComponent?.unit
                                        ? ""
                                        : undefined,
                                      max: selectedComponent?.unit
                                        ? ""
                                        : undefined,
                                    });
                                  }}
                                >
                                  <option value="" disabled>
                                    -- Select Component --
                                  </option>
                                  {/* Support custom name if it doesn't exist in standard list for this type */}
                                  {component.componentName &&
                                    !(electronicComponents.find(c => c.type === component.componentType)?.components.some(comp => comp.name === component.componentName)) && (
                                      <option value={component.componentName}>{component.componentName}</option>
                                    )}
                                  {electronicComponents
                                    .find(
                                      (category) =>
                                        category.type ===
                                        component.componentType
                                    )
                                    ?.components.map((comp, idx) => (
                                      <option key={idx} value={comp.name}>
                                        {comp.name}
                                      </option>
                                    ))}
                                </Field>
                                <label
                                  htmlFor={`components[${index}].componentName`}
                                >
                                  Component Name
                                </label>
                                <ErrorMessage
                                  name={`components[${index}].componentName`}
                                  component="div"
                                  className="text-danger"
                                />
                              </div>
                            )}

                            {Array.isArray(component.unit) &&
                              component.unit.length > 0 && (
                                <div className="form-floating mb-3">
                                  <Field
                                    as="select"
                                    className="form-select"
                                    name={`components[${index}].unit`}
                                  >
                                    <option value="" disabled>
                                      -- Select Unit --
                                    </option>
                                    {component.unit.map((unitOption, idx) => (
                                      <option key={idx} value={unitOption}>
                                        {unitOption}
                                      </option>
                                    ))}
                                  </Field>
                                  <label htmlFor={`components[${index}].unit`}>
                                    Unit
                                  </label>
                                </div>
                              )}

                            {component.unit && component.unit !== "boolean" && (
                              <>
                                <div className="form-floating mb-3">
                                  <Field
                                    type="number"
                                    className="form-control"
                                    name={`components[${index}].min`}
                                  />
                                  <label htmlFor={`components[${index}].min`}>
                                    Minimum
                                  </label>
                                  <ErrorMessage
                                    name={`components[${index}].min`}
                                    component="div"
                                    className="text-danger"
                                  />
                                </div>

                                <div className="form-floating mb-3">
                                  <Field
                                    type="number"
                                    className="form-control"
                                    name={`components[${index}].max`}
                                  />
                                  <label htmlFor={`components[${index}].max`}>
                                    Maximum
                                  </label>
                                  <ErrorMessage
                                    name={`components[${index}].max`}
                                    component="div"
                                    className="text-danger"
                                  />
                                </div>
                              </>
                            )}

                            <div className="form-floating mb-3">
                              <Field
                                as="textarea"
                                className="form-control"
                                name={`components[${index}].note`}
                                style={{ height: "70px" }}
                              />
                              <label htmlFor={`components[${index}].note`}>
                                Note
                              </label>
                            </div>

                            <div className="form-floating mb-3">
                              <Field
                                type="text"
                                className="form-control"
                                name={`components[${index}].urls[0]`}
                              />
                              <label htmlFor={`components[${index}].urls[0]`}>
                                URL
                              </label>
                            </div>

                            <Button
                              type="button"
                              className="w-100 mb-3"
                              colorScheme="yellow"
                              variant={"outline"}
                              onClick={() => helperMethod.remove(index)}
                            >
                              Remove Component
                            </Button>
                          </div>
                        </div>
                      ))}

                      <div>
                        <Button
                          type="button"
                          className="w-100 mb-3 "
                          colorScheme="teal"
                          variant="outline"
                          onClick={() =>
                            helperMethod.push({
                              componentID: "",
                              componentType: "",
                              componentName: "",
                              note: "",
                              urls: [],
                              unit: undefined,
                              min: undefined,
                              max: undefined,
                            })
                          }
                        >
                          Add Component
                        </Button>
                      </div>
                    </div>
                  )}
                </FieldArray>

                <Button
                  type="submit"
                  className="w-100 "
                  disabled={formik.isSubmitting}
                  colorScheme="blue"
                >
                  {formik.isSubmitting ? "Updating..." : "Update"}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Box>
  );
};

export default EditProductDefinition;
