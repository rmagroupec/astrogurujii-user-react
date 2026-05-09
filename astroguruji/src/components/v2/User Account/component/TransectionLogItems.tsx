export default function TransactionItem({ data }: any) {
    const isCredit = data.type === "credit";
  
    return (
      <div className="flex items-center justify-between border-b pb-3 last:border-none">
        
        <div>
          <p className="text-[13px] font-medium text-gray-800">
            {data.message}
          </p>
          <p className="text-[11px] text-gray-500">
            {data.date}
          </p>
        </div>
  
        <div
          className={`text-[13px] font-semibold ${
            isCredit ? "text-green-600" : "text-red-500"
          }`}
        >
          {isCredit ? "+" : "-"} ₹{data.amount}
        </div>
      </div>
    );
  }