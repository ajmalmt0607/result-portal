import { useState } from "react";

const API_URL =
  "https://script.google.com/macros/s/AKfycbzM2ophmrglO18wWd6F7Dc8-WK1fqKKxvwyUSLvDuRY8f5a6jSpRYCraGa9Hz5OUjk6/exec";


// ============================================================
// JSONP FUNCTION
// ============================================================

function fetchResults(enrolNo) {

  return new Promise((resolve, reject) => {

    const callbackName =
      `resultCallback_${Date.now()}`;


    // Create global callback
    window[callbackName] = (data) => {

      resolve(data);

      // Remove callback
      delete window[callbackName];

      // Remove script
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }

    };


    const script =
      document.createElement("script");


    const url =
      `${API_URL}?enrol=${encodeURIComponent(
        enrolNo
      )}&callback=${callbackName}`;


    script.src = url;


    script.onerror = () => {

      reject(
        new Error(
          "Unable to connect to result API"
        )
      );


      delete window[callbackName];


      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }

    };


    document.body.appendChild(script);

  });

}



// ============================================================
// APP
// ============================================================

export default function App() {

  const [enrolNo, setEnrolNo] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [results, setResults] =
    useState([]);

  const [error, setError] =
    useState("");



  // ==========================================================
  // SEARCH
  // ==========================================================

  const handleSearch = async () => {

    if (!enrolNo.trim()) {

      setError(
        "Please enter your enrolment number"
      );

      return;

    }


    setLoading(true);

    setError("");

    setResults([]);


    try {

      const data =
        await fetchResults(
          enrolNo.trim()
        );


      console.log(
        "RESULT:",
        data
      );


      if (!data.found) {

        setError(
          data.message ||
          "Result not found"
        );

        return;

      }


      setResults(
        data.results || []
      );


    } catch (error) {

      console.error(
        "RESULT ERROR:",
        error
      );


      setError(
        "Unable to fetch result. Please try again."
      );


    } finally {

      setLoading(false);

    }

  };



  // ==========================================================
  // ENTER KEY
  // ==========================================================

  const handleKeyDown = (event) => {

    if (event.key === "Enter") {

      handleSearch();

    }

  };



  // ==========================================================
  // UI
  // ==========================================================

  return (

    <div className="min-h-screen bg-slate-100">


      {/* HEADER */}

      <div
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

      </div>



      {/* MAIN */}

      <div
        className="
          max-w-4xl
          mx-auto
          p-4
          md:p-8
        "
      >


        {/* SEARCH */}

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

            <input
              type="text"
              placeholder="Enter Enrol Number"
              value={enrolNo}

              onChange={(e) =>
                setEnrolNo(
                  e.target.value
                )
              }

              onKeyDown={handleKeyDown}

              className="
                border
                border-gray-300
                rounded-lg
                p-3
                flex-1
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
              "
            />


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
              "
            >

              {loading
                ? "Searching..."
                : "Search"
              }

            </button>

          </div>

        </div>



        {/* LOADING */}

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



        {/* ERROR */}

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



        {/* RESULTS */}

        {results.length > 0 && (

          <div
            className="
              mt-8
              space-y-8
            "
          >


            {/* STUDENT */}

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
                "
              >

                Student

              </p>


              <h2
                className="
                  text-2xl
                  font-bold
                  mt-1
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



            {/* EACH RESULT */}

            {results.map(
              (student, index) => (

                <div
                  key={
                    `${student.sheet}-${index}`
                  }

                  className="
                    bg-white
                    rounded-2xl
                    shadow-lg
                    overflow-hidden
                  "
                >


                  {/* COURSE */}

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
                      "
                    >

                      {student.course}

                    </p>


                    <h3
                      className="
                        text-2xl
                        font-bold
                        mt-1
                      "
                    >

                      {student.year}

                    </h3>

                  </div>



                  {/* SUBJECTS */}

                  <div
                    className="
                      overflow-x-auto
                    "
                  >

                    <table
                      className="
                        w-full
                      "
                    >

                      <thead>

                        <tr
                          className="
                            bg-gray-100
                          "
                        >

                          <th
                            className="
                              text-left
                              p-4
                            "
                          >

                            Subject

                          </th>


                          <th
                            className="
                              text-right
                              p-4
                            "
                          >

                            Mark

                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        {student.subjects.map(
                          (
                            subject,
                            subjectIndex
                          ) => (

                            <tr
                              key={
                                subjectIndex
                              }

                              className="
                                border-t
                              "
                            >

                              <td
                                className="
                                  p-4
                                "
                              >

                                {
                                  subject.subject
                                }

                              </td>


                              <td
                                className="
                                  p-4
                                  text-right
                                  font-semibold
                                "
                              >

                                {
                                  subject.mark
                                }

                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>



                  {/* TOTAL */}

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
                      "
                    >

                      <span
                        className="
                          font-semibold
                        "
                      >

                        Total Mark

                      </span>


                      <span
                        className="
                          font-bold
                          text-xl
                        "
                      >

                        {student.total}

                      </span>

                    </div>

                  </div>


                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>

  );

}