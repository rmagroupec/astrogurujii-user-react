export default function RechargeModal({ modal, onClose }: any) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-[300px] text-center animate-scaleIn">
  
          {/* Animation */}
          <div className="text-5xl mb-3">
            {modal.type === "success" ? "✅" : "❌"}
          </div>
  
          <h3 className="font-bold text-lg mb-2">
            {modal.type === "success" ? "Success" : "Failed"}
          </h3>
  
          <p className="text-sm text-gray-600">
            {modal.message}
          </p>
  
          <button
            onClick={onClose}
            className="mt-4 px-5 py-2 bg-brand-orange text-white rounded-full"
          >
            OK
          </button>
        </div>
      </div>
    );
  }