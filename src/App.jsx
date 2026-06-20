import { useState } from "react";

const API_URL =
  "https://script.google.com/macros/s/AKfycbzM2ophmrglO18wWd6F7Dc8-WK1fqKKxvwyUSLvDuRY8f5a6jSpRYCraGa9Hz5OUjk6/exec";

export default function App() {
  const [enrolNo, setEnrolNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!enrolNo.trim()) return;

    setLoading(true);
    setError("");
    setStudent(null);

    try {
      const res = await fetch(
        `${API_URL}?enrol=${enrolNo}`
      );

      const data = await res.json();

      if (!data.found) {
        setError("Result not found");
      } else {
        setStudent(data);
      }
    } catch {
      setError("Unable to fetch result");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100">

      <div className="bg-indigo-700 text-center text-white py-8 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">

          <h1 className="text-3xl font-bold">
            THE BEE ACADEMY
          </h1>

          <p className="mt-2 text-indigo-100">
            International Diploma in Montessori Teachers Training
          </p>

        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8">

        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-xl font-semibold mb-4">
            Check Examination Result
          </h2>

          <div className="flex flex-col md:flex-row gap-3">

            <input
              type="text"
              placeholder="Enter Enrol Number"
              value={enrolNo}
              onChange={(e) =>
                setEnrolNo(e.target.value)
              }
              className="border rounded-lg p-3 flex-1"
            />

            <button
              onClick={handleSearch}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
            >
              Search
            </button>

          </div>

        </div>

        {loading && (
          <div className="text-center mt-8">
            Loading...
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 mt-8 p-4 rounded-lg">
            {error}
          </div>
        )}

        {student && (
          <div className="bg-white mt-8 rounded-2xl shadow-lg overflow-hidden">

            <div className="p-6 border-b">

              <h3 className="text-2xl font-bold">
                {student.name}
              </h3>

              <p className="text-gray-500">
                Enrol No: {student.enrol_no}
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="bg-gray-100">
                    <th className="text-left p-4">
                      Subject
                    </th>

                    <th className="text-right p-4">
                      Mark
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {student.subjects.map(
                    (subject, index) => (
                      <tr
                        key={index}
                        className="border-t"
                      >
                        <td className="p-4">
                          {subject.subject}
                        </td>

                        <td className="p-4 text-right font-medium">
                          {subject.mark}
                        </td>
                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

            <div className="p-6 bg-slate-50">

              <div className="flex justify-between mb-3">

                <span className="font-semibold">
                  Total Mark
                </span>

                <span className="font-bold">
                  {student.total}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="font-semibold">
                  Result
                </span>

                <span
                  className={`font-bold ${
                    student.result === "PASS"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {student.result}
                </span>

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}