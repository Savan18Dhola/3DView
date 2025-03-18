import * as Dialog from "@radix-ui/react-dialog";

const BookingModal = ({ table, onClose, onBook }) => {
  return (
    <Dialog.Root open={!!table} onOpenChange={onClose}>
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
      <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-lg w-64">
        <Dialog.Title className="text-lg font-bold">
          Book Table
        </Dialog.Title>
        <p className="mt-2">Do you want to book this table?</p>
        <div className="mt-4 flex justify-between">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={onBook}
          >
            Yes
          </button>
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            No
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default BookingModal;
