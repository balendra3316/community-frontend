
// components/DeleteModal.tsx
import React, { memo } from "react";

interface DeleteModalProps {
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteModal = memo(({ isDeleting, onConfirm, onCancel }: DeleteModalProps) => (
  <div
    className="fixed inset-0 bg-[rgba(144,144,144,0.6)] bg-opacity-50 flex items-center justify-center z-50"
    onClick={onCancel}
  >
    <div
      className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-xl font-bold mb-4">Delete Post</h3>
      <p className="text-gray-700 mb-6">
        Are you sure you want to delete this post? This action cannot be undone.
      </p>
      <div className="flex justify-end space-x-4">
        <button
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          onClick={onCancel}
          disabled={isDeleting}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
          onClick={onConfirm}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <span className="mr-2">Deleting</span>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </>
          ) : (
            "Delete"
          )}
        </button>
      </div>
    </div>
  </div>
));