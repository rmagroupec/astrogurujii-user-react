export default function TransactionCard({ data }: any) {
    const isCredit = data.amount_type === "Credit";
  
    return (
      <div className="bg-white border rounded-xl p-4 flex justify-between items-center">
  
        <div>
          <p className="font-semibold text-sm">
            Order #{data.order_id || "-"}
          </p>
          <p className="text-xs text-gray-500">
            {data.astro_name || data.type}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {data.transaction_date}
          </p>
        </div>
  
        <div className="text-right">
          <p
            className={`font-bold ${
              isCredit ? "text-green-600" : "text-red-500"
            }`}
          >
            {isCredit ? "+" : "-"} ₹{data.amount}
          </p>
  
          {data.time && (
            <p className="text-xs text-gray-500">
              {data.time} min
            </p>
          )}
        </div>
      </div>
    );
  }