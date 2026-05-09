export default function GiftCard({ data }: any) {
    return (
      <div className="bg-white border rounded-xl p-4 flex justify-between items-center">
  
        <div>
          <p className="font-semibold text-sm">
            From: {data.fromUser?.name}
          </p>
          <p className="text-sm">
            To: {data.toAstro?.displayname}
          </p>
          <p className="text-xs text-gray-500">
            {data.type}
          </p>
          <p className="text-xs text-gray-400">
            {data.createdAt}
          </p>
        </div>
  
        <div className="text-right">
          <p className="font-bold text-green-600">
            ₹{data.amount}
          </p>
  
          {data.gift?.image && (
            <img
              src={data.gift.image}
              className="h-10 w-10 rounded-full mt-2"
            />
          )}
        </div>
      </div>
    );
  }