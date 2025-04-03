import React, { useState } from 'react';
import axios from 'axios';
// import '../styles/DataTypeModify.css'; // Importing the associated CSS for styling
import TARGET_BACKEND_LINK from './global.js';

function EditMapData() {
    // State variables
    const [file, setFile] = useState(null); // Stores the uploaded file
    const [dtypes, setDtypes] = useState([]); // Stores the list of column names and their data types
    const [, setIsEdited] = useState(false); // Tracks if the data has been edited
    const [loading, setLoading] = useState(false); // Tracks the loading state

    // Handles file input change and updates the 'file' state
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Handles the file upload and fetches the initial column data types from the backend
    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file before uploading.');
            return;
        }
        setLoading(true); // Set loading state to true during upload
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Make POST request to backend to process the file
            const response = await axios.post(TARGET_BACKEND_LINK +'/api/types/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Transform response data into a list of key-value pairs for editing
            setDtypes(Object.entries(response.data).map(([key, value]) => ({ key, value })));
            setIsEdited(false); // Reset edit state
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('File upload failed.');
        }
        setLoading(false); // Reset loading state
    };

    // Handles changes to column names (keys)
    const handleKeyChange = (index, newKey) => {
        const updatedDtypes = [...dtypes];
        updatedDtypes[index].key = newKey; // Update the key value
        setDtypes(updatedDtypes);
        setIsEdited(true); // Mark the data as edited
    };

    // Handles changes to data types (values)
    const handleValueChange = (index, newValue) => {
        const updatedDtypes = [...dtypes];
        updatedDtypes[index].value = newValue; // Update the value
        setDtypes(updatedDtypes);
        setIsEdited(true); // Mark the data as edited
    };

    // Saves the edited data and triggers a download of the updated CSV
    const handleSave = async () => {
        setLoading(true); // Set loading state
        // Convert the data into a map format suitable for backend processing
        const updatedMap = dtypes.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {});

        const formData = new FormData();
        formData.append('data', JSON.stringify(updatedMap));

        try {
            // Make POST request to save the updated data and retrieve the modified file
            const response = await axios.post(TARGET_BACKEND_LINK +'/api/save-types/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                responseType: 'blob', // Expect binary file as response
            });

            // Create a downloadable link for the response CSV file
            const blob = new Blob([response.data], { type: 'text/csv' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'output.csv'; // Set download file name
            link.click();
            setIsEdited(false); // Reset edit state
        } catch (error) {
            console.error('Error downloading the CSV:', error);
            alert('Error saving or downloading the file.');
        }
        setLoading(false); // Reset loading state
    };

    // return (
    //     <div>
    //         {/* File input field */}
    //         <input className=" mb-20 "
    //             type="file" onChange={handleFileChange} />
    //
    //         {/* Upload button */}
    //         <button className="ml-10 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    //             onClick={handleUpload} disabled={loading}>
    //             {loading ? 'Uploading...' : 'Upload'}
    //         </button>
    //
    //         {/* Display the data type editing table if data is available */}
    //         {dtypes.length > 0 && (
    //             <div>
    //                 <table border="1">
    //                     <thead>
    //                     <tr>
    //                         <th>Column Name</th>
    //                         <th>Data Type</th>
    //                     </tr>
    //                     </thead>
    //                     <tbody>
    //                     {dtypes.map((item, index) => (
    //                         <tr key={index}>
    //                             <td>
    //                                 {/* Input field for column name */}
    //                                 <input
    //                                     type="text"
    //                                     value={item.key}
    //                                     onChange={(e) => handleKeyChange(index, e.target.value)}
    //                                 />
    //                             </td>
    //                             <td>
    //                                 {/* Dropdown for selecting data type */}
    //                                 <select
    //                                     value={item.value}
    //                                     onChange={(e) => handleValueChange(index, e.target.value)}
    //                                 >
    //                                     <option value="Text">Text</option>
    //                                     <option value="Integer64">Integer64</option>
    //                                     <option value="Integer32">Integer32</option>
    //                                     <option value="Integer16">Integer16</option>
    //                                     <option value="Integer8">Integer8</option>
    //                                     <option value="Decimal64">Decimal64</option>
    //                                     <option value="Decimal32">Decimal32</option>
    //                                     <option value="Date">Date</option>
    //                                     <option value="Datetime(UTC)">Datetime(UTC)</option>
    //                                     <option value="Boolean">Boolean</option>
    //                                     <option value="Category">Category</option>
    //                                     <option value="Time Interval">Time Interval</option>
    //                                     <option value="Complex Number">Complex Number</option>
    //                                 </select>
    //                             </td>
    //                         </tr>
    //                     ))}
    //                     </tbody>
    //                 </table>
    //                 {/* Save and download button */}
    //                 <button onClick={handleSave} disabled={loading || dtypes.length <= 0}>
    //                     {loading ? 'Processing...' : 'Save Changes and Download'}
    //                 </button>
    //             </div>
    //         )}
    //     </div>
    // );
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
            {/* 文件上传区域 */}
            <div className="flex items-center gap-4 mb-8">
                <label className="block">
                    <span className="sr-only">Choose CSV file</span>
                    <input
                        type="file"
                        accept=".csv, text/csv"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-md file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-indigo-50 file:text-indigo-700
                                  hover:file:bg-indigo-100"
                    />
                </label>

                <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs
                              hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2
                              focus-visible:outline-offset-2 focus-visible:outline-indigo-600
                              disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Uploading...
                        </span>
                    ) : 'Upload'}
                </button>
            </div>

            {/* 数据类型编辑表格 */}
            {dtypes.length > 0 && (
                <div className="space-y-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-indigo-50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                    Column Name
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Data Type
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                            {dtypes.map((item, index) => (
                                <tr key={index}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                        <input
                                            type="text"
                                            value={item.key}
                                            onChange={(e) => handleKeyChange(index, e.target.value)}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                                                          placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <select
                                            value={item.value}
                                            onChange={(e) => handleValueChange(index, e.target.value)}
                                            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300
                                                          focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        >
                                            <option value="Text">Text</option>
                                            <option value="Integer64">Integer64</option>
                                            <option value="Integer32">Integer32</option>
                                            <option value="Integer16">Integer16</option>
                                            <option value="Integer8">Integer8</option>
                                            <option value="Decimal64">Decimal64</option>
                                            <option value="Decimal32">Decimal32</option>
                                            <option value="Date">Date</option>
                                            <option value="Datetime(UTC)">Datetime(UTC)</option>
                                            <option value="Boolean">Boolean</option>
                                            <option value="Category">Category</option>
                                            <option value="Time Interval">Time Interval</option>
                                            <option value="Complex Number">Complex Number</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 保存按钮 */}
                    <button
                        onClick={handleSave}
                        disabled={loading || dtypes.length <= 0}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs
                                  hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2
                                  focus-visible:outline-offset-2 focus-visible:outline-indigo-600
                                  disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : 'Save Changes and Download'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default EditMapData;

