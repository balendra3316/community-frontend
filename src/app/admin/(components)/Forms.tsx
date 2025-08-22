import React, { useState } from "react";

import { Image, Resource } from "../_components/courseManagementService";




interface FormProps {
  type?: "course" | "section" | "lesson";
  data: any;
  setData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading?: boolean;
}


export const CourseForm = ({
  data,
  setData,
  onSubmit,
  onCancel,
  isLoading = false,
}: FormProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(
    data.coverImage || null
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData({ ...data, coverImageFile: file });

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded mb-4">
      <h3 className="text-lg font-medium mb-2">
        {data._id ? "Edit Course" : "Create New Course"}
      </h3>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
            rows={3}
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Order
          </label>
          <input
            type="number"
            value={data.order || 0}
            onChange={(e) =>
              setData({ ...data, order: parseInt(e.target.value) })
            }
            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
            min="0"
          />
          <p className="text-sm text-gray-500 mt-1">
            The order in which this course will appear in the list (lower
            numbers appear first)
          </p>
        </div>

        {/* New isPaid field */}
        <div className="mb-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={data.isPaid || false}
              onChange={(e) => setData({ ...data, isPaid: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              This is a paid course
            </span>
          </label>
        </div>

        {/* New price field - only show if isPaid is true */}
        {data.isPaid && (
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="number"
                value={data.price || 0}
                onChange={(e) =>
                  setData({ ...data, price: parseFloat(e.target.value) || 0 })
                }
                className="pl-7 mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
                min="0"
                step="0.01"
                placeholder="0.00"
                required={data.isPaid}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Enter the price for this course in rupees
            </p>
          </div>
        )}


         <div className="mb-3">
     <label className="flex items-center">
       <input
              type="checkbox"
              // START OF FIX: Simplify the checked logic
              checked={data.isPublished || false}
              // END OF FIX
              onChange={(e) => setData({ ...data, isPublished: e.target.checked })}
              className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
            />
      <span className="ml-2 text-sm font-medium text-gray-700">
       Published (Visible to users)
      </span>
     </label>
          <p className="text-sm text-gray-500 mt-1">
            Uncheck this to save the course as a draft.
          </p>
    </div>





        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Cover Image
          </label>

          {/* Image Preview */}
          {previewUrl && (
            <div className="mt-2 mb-2">
              <img
                src={previewUrl}
                alt="Course cover preview"
                className="h-40 object-cover rounded"
              />
            </div>
          )}

          {/* File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm"
          />

          {/* Legacy URL Input (Optional) */}
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">
              Or enter image URL
            </label>
            <input
              type="text"
              value={data.coverImage || ""}
              onChange={(e) => {
                setData({ ...data, coverImage: e.target.value });
                if (e.target.value) {
                  setPreviewUrl(e.target.value);
                }
              }}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
              placeholder="https://"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center min-w-[100px]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {data._id ? "Updating..." : "Creating..."}
              </>
            ) : data._id ? (
              "Update"
            ) : (
              "Create"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};










export const SectionForm = ({
  data,
  setData,
  onSubmit,
  onCancel,
  isLoading,
}: FormProps & { isLoading?: boolean }) => (
  <div className="bg-gray-100 p-4 rounded mb-4">
    <h4 className="text-md font-medium mb-2">
      {data._id ? "Edit" : "Create New"} Section
    </h4>
    <form onSubmit={onSubmit}>
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
          required
        />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">Order</label>
        <input
          type="number"
          value={data.order}
          onChange={(e) =>
            setData({ ...data, order: parseInt(e.target.value, 10) })
          }
          className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
          min="0"
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : data._id ? "Update" : "Create"}
        </button>
      </div>
    </form>
  </div>
);












export const LessonForm = ({
  data,
  setData,
  onSubmit,
  onCancel,
}: FormProps) => {
  const [isLoading, setIsLoading] = useState(false);


  const safeData = {
    ...data,
    images: data.images || [],
    resources: data.resources || [],
    urls: data.urls || [],
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newImages = [...safeData.images];


      if (newImages[index]) {
        newImages[index] = {
          ...newImages[index],
          file,
          url: "", // Clear the URL since we're using a file
          caption: newImages[index].caption || "",
          altText: newImages[index].altText || file.name,
        };
      } else {
        newImages[index] = {
          url: "",
          caption: "",
          altText: file.name,
          file,
        };
      }

      setData({ ...data, images: newImages });
    }
  };

  const handleResourceUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newResources = [...safeData.resources];


      let fileType = "document";
      if (file.type.includes("pdf")) {
        fileType = "pdf";
      } else if (file.type.includes("doc") || file.type.includes("word")) {
        fileType = "doc";
      }


      if (newResources[index]) {
        newResources[index] = {
          ...newResources[index],
          file,
          fileUrl: "", // Clear the URL since we're using a file
          title: newResources[index].title || file.name,
          fileType,
        };
      } else {
        newResources[index] = {
          title: file.name,
          fileUrl: "",
          fileType,
          file,
        };
      }

      setData({ ...data, resources: newResources });
    }
  };

  const addNewImageField = () => {
    setData({
      ...data,
      images: [...safeData.images, { url: "", caption: "", altText: "" }],
    });
  };

  const addNewResourceField = () => {
    setData({
      ...data,
      resources: [
        ...safeData.resources,
        { title: "", fileUrl: "", fileType: "pdf" },
      ],
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...safeData.images];
    newImages.splice(index, 1);
    setData({ ...data, images: newImages });
  };

  const handleRemoveResource = (index: number) => {
    const newResources = [...safeData.resources];
    newResources.splice(index, 1);
    setData({ ...data, resources: newResources });
  };


  const addNewUrlField = () => {
  setData({
    ...data,
    urls: [...safeData.urls, { title: "", url: "" }],
  });
};

const handleRemoveUrl = (index: number) => {
  const newUrls = [...safeData.urls];
  newUrls.splice(index, 1);
  setData({ ...data, urls: newUrls });
};






  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSubmit(e);
    setIsLoading(false);
  };

  return (
    <div className="bg-gray-100 p-4 rounded mb-3">
      <h4 className="text-md font-medium mb-2">
        {data._id ? "Edit" : "Create New"} Lesson
      </h4>
      <form onSubmit={handleSubmitForm}>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Order
          </label>
          <input
            type="number"
            value={data.order}
            onChange={(e) =>
              setData({ ...data, order: parseInt(e.target.value) || 0 })
            }
            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            value={data.content}
            onChange={(e) => setData({ ...data, content: e.target.value })}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
            rows={3}
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Video URL
          </label>
          <input
            type="text"
            value={data.videoUrl || ""}
            onChange={(e) => setData({ ...data, videoUrl: e.target.value })}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Published
          </label>
          <input
            type="checkbox"
            checked={data.isPublished || false}
            onChange={(e) =>
              setData({ ...data, isPublished: e.target.checked })
            }
            className="mt-1 rounded border-gray-300 shadow-sm p-2"
          />
        </div>

        {/* Images Section */}
        <div className="mb-5 border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Images
            </label>
            <button
              type="button"
              onClick={addNewImageField}
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
            >
              Add Image
            </button>
          </div>

          {safeData.images.map((image: Image, index: number) => (
            <div
              key={`image-${index}`}
              className="mb-3 p-3 bg-white rounded shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Image {index + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded text-xs"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, index)}
                    className="mt-1 block w-full text-xs"
                  />
                  {image.file && (
                    <div className="mt-2 text-xs text-gray-500">
                      File selected: {image.file.name}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-gray-600">
                    Or Image URL
                  </label>
                  <input
                    type="text"
                    value={image.url || ""}
                    onChange={(e) => {
                      const newImages = [...safeData.images];

                      if (e.target.value) {
                        delete newImages[index].file;
                      }
                      newImages[index] = {
                        ...newImages[index],
                        url: e.target.value,
                      };
                      setData({ ...data, images: newImages });
                    }}
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 text-xs"
                    placeholder="https://example.com/image.jpg"
                  />
                  {image.url && !image.file && (
                    <div className="mt-2 text-xs text-gray-500">
                      Using URL:{" "}
                      {image.url.length > 40
                        ? `${image.url.substring(0, 40)}...`
                        : image.url}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <div>
                  <label className="block text-xs text-gray-600">Caption</label>
                  <input
                    type="text"
                    value={image.caption || ""}
                    onChange={(e) => {
                      const newImages = [...safeData.images];
                      newImages[index] = {
                        ...newImages[index],
                        caption: e.target.value,
                      };
                      setData({ ...data, images: newImages });
                    }}
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    value={image.altText || ""}
                    onChange={(e) => {
                      const newImages = [...safeData.images];
                      newImages[index] = {
                        ...newImages[index],
                        altText: e.target.value,
                      };
                      setData({ ...data, images: newImages });
                    }}
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 text-xs"
                  />
                </div>
              </div>
            </div>
          ))}

          {safeData.images.length === 0 && (
            <p className="text-gray-500 text-xs italic">No images added yet.</p>
          )}
        </div>

        {/* Resources Section */}
        <div className="mb-5 border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Resources
            </label>
            <button
              type="button"
              onClick={addNewResourceField}
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
            >
              Add Resource
            </button>
          </div>

          {safeData.resources.map((resource: Resource, index: number) => (
            <div
              key={`resource-${index}`}
              className="mb-3 p-3 bg-white rounded shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  Resource {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveResource(index)}
                  className="bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded text-xs"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600">Title</label>
                  <input
                    type="text"
                    value={resource.title || ""}
                    onChange={(e) => {
                      const newResources = [...safeData.resources];
                      newResources[index] = {
                        ...newResources[index],
                        title: e.target.value,
                      };
                      setData({ ...data, resources: newResources });
                    }}
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 text-xs"
                    placeholder="Resource title"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600">
                    File Type
                  </label>
                  <select
                    value={resource.fileType || "document"}
                    onChange={(e) => {
                      const newResources = [...safeData.resources];
                      newResources[index] = {
                        ...newResources[index],
                        fileType: e.target.value,
                      };
                      setData({ ...data, resources: newResources });
                    }}
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 text-xs"
                  >
                    <option value="pdf">PDF</option>
                    <option value="doc">DOC</option>
                    <option value="document">Other Document</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <div>
                  <label className="block text-xs text-gray-600">
                    Upload File
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => handleResourceUpload(e, index)}
                    className="mt-1 block w-full text-xs"
                  />
                  {resource.file && (
                    <div className="mt-2 text-xs text-gray-500">
                      File selected: {resource.file.name}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-gray-600">
                    Or Resource URL
                  </label>
                  <input
                    type="text"
                    value={resource.fileUrl || ""}
                    onChange={(e) => {
                      const newResources = [...safeData.resources];

                      if (e.target.value) {
                        delete newResources[index].file;
                      }
                      newResources[index] = {
                        ...newResources[index],
                        fileUrl: e.target.value,
                      };
                      setData({ ...data, resources: newResources });
                    }}
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 text-xs"
                    placeholder="https://example.com/document.pdf"
                  />
                  {resource.fileUrl && !resource.file && (
                    <div className="mt-2 text-xs text-gray-500">
                      Using URL:{" "}
                      {resource.fileUrl.length > 40
                        ? `${resource.fileUrl.substring(0, 40)}...`
                        : resource.fileUrl}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {safeData.resources.length === 0 && (
            <p className="text-gray-500 text-xs italic">
              No resources added yet.
            </p>
          )}
        </div>




{/* URLs Section */}
<div className="mb-5 border-t border-gray-200 pt-4">
  <div className="flex justify-between items-center mb-2">
    <label className="block text-sm font-medium text-gray-700">
      URLs
    </label>
    <button
      type="button"
      onClick={addNewUrlField}
      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
    >
      Add URL
    </button>
  </div>

  {safeData.urls.map((urlItem : any, index:number) => (
    <div
      key={`url-${index}`}
      className="mb-3 p-3 bg-white rounded shadow-sm"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">URL {index + 1}</span>
        <button
          type="button"
          onClick={() => handleRemoveUrl(index)}
          className="bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded text-xs"
        >
          Remove
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-600">Title</label>
          <input
            type="text"
            value={urlItem.title || ""}
            onChange={(e) => {
              const newUrls = [...safeData.urls];
              newUrls[index] = {
                ...newUrls[index],
                title: e.target.value,
              };
              setData({ ...data, urls: newUrls });
            }}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 text-xs"
            placeholder="URL title"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600">URL</label>
          <input
            type="url"
            value={urlItem.url || ""}
            onChange={(e) => {
              const newUrls = [...safeData.urls];
              newUrls[index] = {
                ...newUrls[index],
                url: e.target.value,
              };
              setData({ ...data, urls: newUrls });
            }}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 text-xs"
            placeholder="https://example.com"
          />
        </div>
      </div>
    </div>
  ))}

  {safeData.urls.length === 0 && (
    <p className="text-gray-500 text-xs italic">No URLs added yet.</p>
  )}
</div>






        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-xs"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-xs flex items-center ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {data._id ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>{data._id ? "Update" : "Create"}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
