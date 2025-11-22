import "./CreateProductDefinition.css";
import { electronicComponents } from "./electronicComponents";
import { useEffect, useState } from "react";
import { Formik, Field, Form, FieldArray, ErrorMessage } from "formik";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Navbarone from "../../Navbarone";
import { Box, Center, Heading, Text } from "@chakra-ui/react";
import Ellipse521 from "../../../images/Ellipse 521.svg";
import Footer from "../../Footer";
import { Button } from "@chakra-ui/react";
import { getUserInfo } from "../../../utilities";
import { useProject } from "../../../ProjectContext";
import { baseURL } from "../../../utilities";

const CreateProductDefinition = ({
  productID,
  productName,
  onClose,
  fetchFileSystem,
  setIsProductDefined,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [visibleComponents, setVisibleComponents] = useState([]);
  const [userId, setUserId] = useState(null);

  const { activeProjectId } = useProject();

  const getStoredValues = () => {
    const storedValues = sessionStorage.getItem("productDefinition");
    if (storedValues) {
      return JSON.parse(storedValues);
    }

    if (location.state?.productID && location.state?.deviceName) {
      const newValues = {
        productID: location.state.productID,
        productName: productName,
      };
      sessionStorage.setItem("productDefinition", JSON.stringify(newValues));
      return newValues;
    }

    return {
      productID: "",
      productName: "",
    };
  };

  const [initialValues, setInitialValues] = useState({
    productID: productID,
    productName: productName,
    components: [],
  });

  const toggleVisibility = (index) => {
    setVisibleComponents((prev) =>
      prev.includes(index)
        ? prev.filter((id) => id !== index)
        : [...prev, index]
    );
  };

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
      productName: values.productName,
    };

    console.log("result data", resultData);

    try {
      const response = await axios.post(
        `${baseURL}/product/${values.productID}/definition`,
        resultData
      );
      console.log("Data successfully sent to the server:", response.data);

      alert("Product defined successfully!");

      if (userId) await fetchFileSystem(userId);

      setIsProductDefined(() => true);

      // close modal on success
      onClose();
    } catch (error) {
      console.error(
        "Error sending data to the server:",
        error.response?.data?.message
      );
      alert("Error submitting form. Please try again.");
      throw error; // Re-throw to be caught by the form submission handler
    }
  };

  useEffect(() => {
    setInitialValues({
      productID: productID,
      productName: productName,
      components: [],
    });
  }, [productID]);

  useEffect(() => {
    return () => {
      const userInfo = getUserInfo();
      if (userInfo) {
        fetchFileSystem(userInfo.userId);
      }
    };
  }, []);

  return (
    <Box>
      {/* <Navbarone /> */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="rounded p-4 border w-100">
          {/* <h3 className="m-4 text-dark text-center">
            {initialValues.productName}
          </h3> */}

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
                                {electronicComponents.map((category, idx) => (
                                  <option key={idx} value={category.type}>
                                    {category.type}
                                  </option>
                                ))}
                              </Field>
                              <label htmlFor={`components[${index}].componentType`}>
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
                                      unit: selectedComponent?.unit || undefined,
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
                                  {electronicComponents
                                    .find(
                                      (category) =>
                                        category.type === component.componentType
                                    )
                                    ?.components.map((comp, idx) => (
                                      <option key={idx} value={comp.name}>
                                        {comp.name}
                                      </option>
                                    ))}
                                </Field>
                                <label htmlFor={`components[${index}].componentName`}>
                                  Component Name
                                </label>
                                <ErrorMessage
                                  name={`components[${index}].componentName`}
                                  component="div"
                                  className="text-danger"
                                />
                              </div>
                            )}

                            {component.unit && (
                              <div className="form-floating mb-3">
                                <Field
                                  as="select"
                                  className="form-select"
                                  name={`components[${index}].unit`}
                                >
                                  <option value="" disabled>
                                    -- Select Unit --
                                  </option>
                                  {component.unit?.map((unitOption, idx) => (
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
                            <Center>
                              <Button
                                variant={"outline"}
                                colorScheme="red"
                                size={"sm"}
                                onClick={() => helperMethod.remove(index)}
                              >
                                Remove Component
                              </Button>
                            </Center>
                          </div>
                        </div>
                      ))}

                      <Button
                        className="w-100 mb-3"
                        variant={"outline"}
                        size="sm"
                        colorScheme={"green"}
                        onClick={() =>
                          helperMethod.push({
                            componentID: "",
                            componentType: "",
                            componentName: "",
                            unit: undefined,
                            min: undefined,
                            max: undefined,
                          })
                        }
                      >
                        Add Component
                      </Button>
                    </div>
                  )}
                </FieldArray>

                <Button
                  type="submit"
                  className=" w-100 "
                  disabled={formik.isSubmitting}
                  colorScheme="blue"
                  size={"sm"}
                >
                  {formik.isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      {/* <Footer /> */}
    </Box>
  );
};

export default CreateProductDefinition;
