# Data Type Inference Web Page(Frontend)

A web-based tool for inferring and modifying data types of columns in a CSV file, built with React (Frontend) and Django (Backend).

## Project Overview
This project enables users to upload a CSV file, infer the data types of its columns, and interactively modify these data types as needed.
The adjusted file is then processed by the backend to apply the desired data type conversions and returned for download.

### Features:
Automatically infer data types of columns in a CSV file.

Modify inferred data types using an intuitive dropdown interface.

Save changes and download the updated file with enforced type conversions.

Seamless integration between the React frontend and Django backend.

## Repositories
Frontend (this repository): [Data_Inference_Web_Page_Frontend](https://github.com/MaxwellJia/Data_Inference_Web_Page_Frontend)
Backend: [Data_Inference_Web_Page_Backend](https://github.com/MaxwellJia/Data_Inference_Web_Page_Backend)

## Project Workflow
1. Upload: Users upload a CSV file via the frontend.

2. Infer: The backend analyzes the file and predicts the data types of each column.

3. Modify: Users review and modify the inferred data types through dropdown menus on the webpage.

4. Download: After confirming the changes, the backend enforces the conversions and provides the modified file for download.

## Installation

Note: This web page is developed using webstorm and pycharm.

Follow these steps to start the frontend of the project (in local terminal):

1. Clone the repository to a directory(Example: frontend):
   ```bash
   git clone https://github.com/MaxwellJia/Data_Inference_Web_Page_Frontend.git

2. Install relative dependencies, modules or libraries (Or just start the project and it will alert you to install)


3. Start the backend following the github: https://github.com/MaxwellJia/Data_Inference_Web_Page_Backend.


4. Jump to [README file in my-frontend](my-frontend/README.md) and use npm start to start the project.

## Web Page Screen Shot
![img](./DataInferenceFE.png)


## Contact Information

For any questions or suggestions, feel free to contact me at maxwelljia1@gmail.com

## Summary

This project is built to infer data type of the columns in a csv file using React+Django, this is the frontend

of the web page. The backend is in https://github.com/MaxwellJia/Data_Inference_Web_Page_Backend.

The input of this project is a csv file, and the webpage will then show the results of inferred data types. Next,

you can modify the data types if you think the result is not correct in drop-down box, then click "Save and Download", the backend will force conversion to the data type you want and return the corresponding file to you(download to your default directory).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
