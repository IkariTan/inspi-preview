import { useEffect, useState } from "react";
import { ProductCard } from "./product-card";

export interface CSVRow {
  image_link: string;
  url1?: string;
  url2?: string;
  url3?: string;
  url4?: string;
  url5?: string;
  url6?: string;
}

export type Match = "exact" | "closest" | "similar_vibe" | "";

export interface WorkableData {
  image_link: string;
  variant_handles: {
    handle: string;
    match: Match;
  }[];
}

export default function App() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [formattedCSV, setFormattedCSV] = useState<WorkableData[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleCSVContent = (content: string) => {
    // Split the content by new line
    // Remove the first element (header)
    // Split each row by comma
    // Map each row to an object
    // Add the object to the formattedCSV state

    const rows = content.split("\r\n").slice(1);

    const data = rows
      .map((row) => {
        const [image_link, ...urls] = row.split(",");

        return {
          image_link,
          variant_handles: urls
            .map((url) => url.trim())
            .filter((url) => url.length > 0)
            .map((url) => {
              const handle = url
                .replace("https://materialdepot.in/", "")
                .replace("/product", "");
              return {
                handle,
                match: "" as Match,
              };
            }),
        };
      })
      .filter(({ image_link }) => image_link.trim() !== "");

    setFormattedCSV(data);
  };

  useEffect(() => {
    if (!csvFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;

      handleCSVContent(text);
    };
    reader.readAsText(csvFile);
  }, [csvFile]);

  const exportCSV = () => {
    // Each row will have a single entry of the combination of Image URL, Variant Handle, and Match
    // The first row will be the header
    // The subsequent rows will be the data
    const data = formattedCSV
      .map(({ image_link, variant_handles }) =>
        variant_handles.map(({ handle, match }) => ({
          image_link,
          handle,
          match,
        }))
      )
      .flat();

    const csvContent = [
      ["Image URL", "Variant Handle", "Match"].join(","),
      ...data.map(({ image_link, handle, match }) =>
        [image_link, handle, match].join(",")
      ),
    ].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "output.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <section className="flex h-screen font-sans">
      <button
        className="bg-blue-500 text-white p-2 fixed bottom-2 right-2 rounded"
        onClick={exportCSV}
      >
        Download
      </button>
      <div
        className={`h-full w-[300px] min-w-[300px] bg-gray-100 overflow-y-auto overflow-x-hidden`}
      >
        <div className="text-sm">Upload CSV File</div>
        <input
          type="file"
          onChange={(ev) => {
            const file = ev.target.files?.[0];
            if (file) setCsvFile(file);
          }}
        />

        <ul className="mt-4">
          {formattedCSV.map((data, index) => (
            <li
              key={index}
              className={`cursor-pointer ${
                activeIndex === index ? "bg-gray-400" : "bg-gray-200"
              } p-2 mb-2 rounded mx-2`}
              onClick={() => setActiveIndex(index)}
            >
              <div className="text-xs mb-2">#{index + 1}</div>
              <div className="text-sm">
                {data.image_link.substring(0, 40)}...
              </div>
              {/* <div className="text-xs text-gray-500">
                {data.variant_handles.join(", ")}
              </div> */}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-grow h-full p-6 flex overflow-y-auto">
        <div className="mr-8">
          <img
            className="min-w-[500px] w-[500px] h-auto rounded-lg"
            src={formattedCSV[activeIndex]?.image_link}
          />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4 flex-grow">
          {formattedCSV?.[activeIndex]?.variant_handles.map(
            ({ handle, match }, index) => (
              <ProductCard
                key={index}
                variant_handle={handle}
                match={match}
                onMatchChange={(match: Match) => {
                  const newFormattedCSV = [...formattedCSV];
                  newFormattedCSV[activeIndex].variant_handles[index].match =
                    match;
                  setFormattedCSV(newFormattedCSV);
                }}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}
