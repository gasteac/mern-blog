import { Button, FileInput, Select, TextInput } from 'flowbite-react'
import React from 'react'
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export const CreatePost = () => {
  return (
    <div className="min-h-screen p-3 max-w-3xl mx-auto">
      <h1 className="text-center text-3xl font-semibold my-7">Create a post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <TextInput
            type="text"
            placeholder="Title"
            required
            className="flex-1"
          />
          <Select>
            <option value="unselected">Select Category</option>
            <option value="javascript">Javascript</option>
            <option value="react">React.js</option>
            <option value="react">Next.js</option>
          </Select>
        </div>
        <div className="flex items-center gap-4 justify-between border-4 border-teal-400 border-dotted p-3">
          <FileInput type="file" accept="image/*" />
          <Button type="button" gradientDuoTone="purpleToBlue" size="sm">
            Upload Image
          </Button>
        </div>
        <ReactQuill theme="snow" placeholder='Write something' className='h-72 mb-12'/>
      </form>
    </div>
  );
}
