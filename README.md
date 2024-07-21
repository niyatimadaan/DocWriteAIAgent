# Document Storage Application

This application is a document storage system built with Next.js, Tailwind CSS, and integrated with the TinyMCE editor for rich text editing. It uses UploadThing for handling document storage and Vercel PostgreSQL for database management.

## Features

- Rich Text Editing with TinyMCE
- Responsive UI with Tailwind CSS
- Document Storage via UploadThing
- Database Management with Vercel PostgreSQL

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/niyatimadaan/next-tinymce.git
   ```

2. Navigate to the project directory:
   ```
   cd next-tinymce
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Create a `.env` file with your environment variables, including:
   - `UPLOADTHING_API_KEY`: Your UploadThing API key
   - `VERCEL_POSTGRESQL_URL`: Your Vercel PostgreSQL connection string

5. Start the development server:
   ```
   npm run dev
   ```

## Usage

Once the application is running, you can create, edit, and store documents using the TinyMCE editor.

## Deployment

To deploy the application to Vercel, follow these steps:

1. Push your code to a Git repository (e.g., GitHub).
2. Import the project into Vercel using the [Vercel Dashboard](https://vercel.com/dashboard).
3. Configure your environment variables in the Vercel dashboard.
4. Deploy the application.

## Screen Recording

Check out the `public` folder for a screen recordings of the project in action (`next-tinymce\public\project-screenshots`).

## Contributing

If you find a bug or have a feature request, please open an issue. For other discussions, feel free to start a discussion.
