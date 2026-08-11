import { useState } from "react";

const API_URL =
  "https://script.google.com/macros/s/AKfycbxJf0TrTW7r6IkrXGqcnktzw4hKmMGtPnC7iTcU_9HPHMxD0ygijySMpDruCa5H7AJw3w/exec";

export default function App() {
  const [enrolNo, setEnrolNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  // ============================================================
  // SEARCH RESULT
  // ============================================================

  const handleSearch = async () => {
    const enrollment = enrolNo.trim();

    if (!enrollment) {
      setError("Please enter your enrolment number");
      setResults([]);
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const url =
        `${API_URL}?enrol=${encodeURIComponent(enrollment)}`;

      console.log("=================================");
      console.log("REQUEST URL:", url);
      console.log("=================================");

      const response = await fetch(url, {
        method: "GET",
      });

      console.log("HTTP STATUS:", response.status);
      console.log("RESPONSE TYPE:", response.type);
      console.log("RESPONSE URL:", response.url);

      if (!response.ok) {
        throw new Error(
          `HTTP error ${response.status}`
        );
      }

      const text = await response.text();

      console.log("RAW API RESPONSE:", text);

      let data;

      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error(
          "JSON PARSE ERROR:",
          jsonError
        );

        throw new Error(
          "API did not return valid JSON"
        );
      }

      console.log("PARSED API RESPONSE:", data);

      if (data.error) {
        setError(
          data.message || "Server error"
        );
        return;
      }

      if (!data.found) {
        setError(
          data.message || "Result not found"
        );
        return;
      }

      setResults(data.results || []);

    } catch (error) {
      console.error(
        "================================="
      );

      console.error(
        "FULL API ERROR:",
        error
      );

      console.error(
        "ERROR MESSAGE:",
        error.message
      );

      console.error(
        "================================="
      );

      setError(
        error.message ||
        "Unable to fetch result. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // ENTER KEY
  // ============================================================

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ========================================================
          HEADER
      ======================================================== */}

      <header
        className="
          bg-indigo-700
          text-center
          text-white
          py-8
          shadow-lg
        "
      >
        <div
          className="
            max-w-6xl
            mx-auto
            px-4
          "
        >
          <h1
            className="
              text-3xl
              md:text-4xl
              font-bold
            "
          >
            THE BEE ACADEMY
          </h1>

          <p
            className="
              mt-2
              text-indigo-100
            "
          >
            Examination Results
          </p>
        </div>
      </header>


      {/* ========================================================
          MAIN
      ======================================================== */}

      <main
        className="
          max-w-4xl
          mx-auto
          p-4
          md:p-8
        "
      >

        {/* ======================================================
            SEARCH BOX
        ====================================================== */}

        <div
          className="
            bg-white
            rounded-2xl
            shadow-lg
            p-6
          "
        >

          <h2
            className="
              text-xl
              font-semibold
              mb-4
            "
          >
            Check Examination Result
          </h2>


          <div
            className="
              flex
              flex-col
              md:flex-row
              gap-3
            "
          >

            {/* INPUT */}

            <input
              type="text"
              placeholder="Enter Enrol Number"
              value={enrolNo}
              onChange={(event) => {
                setEnrolNo(event.target.value);
              }}
              onKeyDown={handleKeyDown}
              disabled={loading}
              className="
                border
                border-gray-300
                rounded-lg
                p-3
                flex-1
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
                disabled:bg-gray-100
              "
            />


            {/* BUTTON */}

            <button
              onClick={handleSearch}
              disabled={loading}
              className="
                bg-indigo-600
                text-white
                px-6
                py-3
                rounded-lg
                font-medium
                hover:bg-indigo-700
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {loading
                ? "Searching..."
                : "Search"
              }
            </button>

          </div>

        </div>


        {/* ======================================================
            LOADING
        ====================================================== */}

        {loading && (
          <div
            className="
              text-center
              mt-8
              text-gray-600
            "
          >
            Loading result...
          </div>
        )}


        {/* ======================================================
            ERROR
        ====================================================== */}

        {error && (
          <div
            className="
              bg-red-50
              border
              border-red-200
              text-red-600
              mt-8
              p-4
              rounded-lg
            "
          >
            {error}
          </div>
        )}


        {/* ======================================================
            RESULTS
        ====================================================== */}

        {results.length > 0 && (

          <div
            className="
              mt-8
              space-y-8
            "
          >

            {/* ==================================================
                STUDENT INFORMATION
            ================================================== */}

            <div
              className="
                bg-white
                rounded-2xl
                shadow-lg
                p-6
              "
            >

              <p
                className="
                  text-sm
                  text-gray-500
                  uppercase
                  tracking-wide
                "
              >
                Student
              </p>


              <h2
                className="
                  text-2xl
                  font-bold
                  mt-1
                  text-gray-900
                "
              >
                {results[0].name}
              </h2>


              <p
                className="
                  text-gray-500
                  mt-1
                "
              >
                Enrol No:{" "}
                {results[0].enrol_no}
              </p>

            </div>


            {/* ==================================================
                ALL RESULTS
            ================================================== */}

            {results.map((student, index) => (

              <div
                key={`${student.sheet}-${index}`}
                className="
                  bg-white
                  rounded-2xl
                  shadow-lg
                  overflow-hidden
                "
              >

                {/* =================================================
                    COURSE HEADER
                ================================================= */}

                <div
                  className="
                    p-6
                    border-b
                  "
                >

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-indigo-600
                      uppercase
                      tracking-wide
                    "
                  >
                    {student.course}
                  </p>


                  <h3
                    className="
                      text-2xl
                      font-bold
                      mt-1
                      text-gray-900
                    "
                  >
                    {student.year}
                  </h3>

                </div>


                {/* =================================================
                    SUBJECT TABLE
                ================================================= */}

                <div className="overflow-x-auto">

                  <table className="w-full">

                    <thead>

                      <tr className="bg-gray-100">

                        <th
                          className="
                            text-left
                            p-4
                            font-semibold
                            text-gray-700
                          "
                        >
                          Subject
                        </th>


                        <th
                          className="
                            text-right
                            p-4
                            font-semibold
                            text-gray-700
                          "
                        >
                          Mark
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {student.subjects?.map(
                        (subject, subjectIndex) => (

                          <tr
                            key={subjectIndex}
                            className="border-t"
                          >

                            <td
                              className="
                                p-4
                                text-gray-700
                              "
                            >
                              {subject.subject}
                            </td>


                            <td
                              className="
                                p-4
                                text-right
                                font-semibold
                              "
                            >
                              {subject.mark}
                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>


                {/* =================================================
                    TOTAL
                ================================================= */}

                <div
                  className="
                    p-6
                    bg-slate-50
                  "
                >

                  <div
                    className="
                      flex
                      justify-between
                      items-center
                    "
                  >

                    <span
                      className="
                        font-semibold
                        text-gray-700
                      "
                    >
                      Total Mark
                    </span>


                    <span
                      className="
                        font-bold
                        text-xl
                        text-gray-900
                      "
                    >
                      {student.total}
                    </span>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}