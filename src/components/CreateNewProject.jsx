import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import axios from 'axios';

const CreateNewProject = ({ onClose, fileSystem, refreshFileSystem }) => {
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('bare-metal');
  const [board, setBoard] = useState('stm32');
  const [additionalOptions, setAdditionalOptions] = useState('');

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const userId = '67add4f3d16ff7c76ba10bcf'; // Hardcoded for now

    try {
      // First API request to create a product
      const productResponse = await axios.post("https://eureka.innotrat.in/product", {
        name: projectName,
        userId,
      });

      const productId = productResponse.data.productID;
      if (!productId) throw new Error("Product ID not received.");

      // Second API request to create the project folder
      const fileResponse = await axios.post(
        "https://eureka.innotrat.in/api/v1/createFileAndFolder",
        {
          // Assuming root folder is available or needs to be fetched
          parentId: fileSystem?._id,
          name: projectName,
          type: 'folder',
          userId,
          productId,
          projectType: projectType,
          boardType: board,
          features: [additionalOptions],
        }
      );

      const projectFolder = fileResponse.data.file;
      if (!projectFolder || !projectFolder._id) throw new Error("Project folder creation failed.");

      // Third API request to create the simulation.c file
      await axios.post(
        "https://eureka.innotrat.in/api/v1/createFileAndFolder",
        {
          parentId: projectFolder._id,
          name: "simulation.c",
          type: "file",
          userId,
          content: `// Simulation file for ${projectName}`
        }
      );

      alert(`${projectName} project created successfully with simulation.c`);
      onClose(); // Close the modal on success
      if (refreshFileSystem && refreshFileSystem.current) {
        refreshFileSystem.current();
      }
    } catch (error) {
      console.error("Error creating project:", error);
      alert(
        error.response?.data?.message || error.message || "An error occurred."
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Project</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <FiX size={24} />
          </button>
        </div>
        <form onSubmit={handleCreateProject}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name *</label>
            <input 
              type="text" 
              placeholder="enter project name" 
              className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Type *</label>
            <div className="flex items-center">
              <input 
                type="radio" 
                name="projectType" 
                value="bare-metal" 
                checked={projectType === 'bare-metal'}
                onChange={() => setProjectType('bare-metal')}
                className="form-radio" 
              />
              <span className="ml-2 text-gray-900 dark:text-white">Bare Metal</span>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Board *</label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input 
                  type="radio" 
                  name="board" 
                  value="stm32" 
                  checked={board === 'stm32'}
                  onChange={() => setBoard('stm32')}
                  className="form-radio" 
                />
                <span className="ml-2 text-gray-900 dark:text-white">STM32 U5</span>
              </div>
              <div className="flex items-center">
                <input 
                  type="radio" 
                  name="board" 
                  value="nrf52840" 
                  checked={board === 'nrf52840'}
                  onChange={() => setBoard('nrf52840')}
                  className="form-radio" 
                />
                <span className="ml-2 text-gray-900 dark:text-white">NRF52840</span>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Options</label>
            <div className="space-y-2">
              {['write-code', 'flow-chart', 'block-diagram', 'simulation'].map(option => (
                <div className="flex items-center" key={option}>
                  <input 
                    type="radio" 
                    name="additionalOptions" 
                    value={option} 
                    checked={additionalOptions === option}
                    onChange={() => setAdditionalOptions(option)}
                    className="form-radio" 
                  />
                  <span className="ml-2 text-gray-900 dark:text-white">{option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-3 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-md bg-blue-500 text-white">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewProject;
