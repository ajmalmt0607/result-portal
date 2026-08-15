import { useEffect, useRef, useState } from "react";
import {
  Building2,
  Check,
  ChevronDown,
  GraduationCap,
  Loader2,
  Shirt,
} from "lucide-react";


// ============================================================
// API URLS
// ============================================================

const API_URLS = {

  bee:
    "https://script.google.com/macros/s/AKfycbzlO179QjY43iWzknl722cGDSaaVmaHGdgz6kUzsD6x8ksL-O5ufa4ocSlCqrucgZ9d/exec",

  bridge:
    "https://script.google.com/macros/s/AKfycby9i5fnrZNhXJdOd7FZ1nzUaLoPkzRuoolJfZmfOTg5u5UB7ZSvPFICvRupHPN78hzd/exec"

};


// ============================================================
// ACADEMY OPTIONS
// ============================================================

const ACADEMIES = [

  {
    id: "bee",
    name: "The Bee Academy",
    icon: GraduationCap,
  },

  {
    id: "bridge",
    name: "Bridge Academy",
    icon: Building2,
  },

];


export default function App() {

  const [academy, setAcademy] =
    useState("bee");


  const [enrolNo, setEnrolNo] =
    useState("");


  const [loading, setLoading] =
    useState(false);


  // Student information
  const [student, setStudent] =
    useState(null);


  // Individual results
  const [results, setResults] =
    useState([]);


  const [error, setError] =
    useState("");


  // Academy dropdown open state
  const [academyOpen, setAcademyOpen] =
    useState(false);

  const academyRef = useRef(null);

  const selectedAcademy =
    ACADEMIES.find(
      (item) => item.id === academy
    ) || ACADEMIES[0];


  // ============================================================
  // CLOSE ACADEMY DROPDOWN ON OUTSIDE CLICK
  // ============================================================

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        academyRef.current &&
        !academyRef.current.contains(event.target)
      ) {

        setAcademyOpen(false);

      }

    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);


  // ============================================================
  // SEARCH RESULT
  // ============================================================

  const handleSearch = async () => {

    const enrollment =
      enrolNo.trim();


    if (!enrollment) {

      setError(
        "Please enter your enrolment number"
      );

      setStudent(null);
      setResults([]);

      return;

    }


    setLoading(true);

    setError("");

    setStudent(null);

    setResults([]);


    try {

      // ========================================================
      // SELECT API BASED ON ACADEMY
      // ========================================================

      const apiUrl =
        API_URLS[academy];


      if (!apiUrl) {

        throw new Error(
          "API URL is not configured"
        );

      }


      const url =
        `${apiUrl}?enrol=${encodeURIComponent(
          enrollment
        )}`;


      console.log(
        "================================="
      );

      console.log(
        "ACADEMY:",
        academy
      );

      console.log(
        "REQUEST URL:",
        url
      );

      console.log(
        "================================="
      );


      const response =
        await fetch(
          url,
          {
            method: "GET"
          }
        );


      console.log(
        "HTTP STATUS:",
        response.status
      );


      console.log(
        "RESPONSE TYPE:",
        response.type
      );


      console.log(
        "RESPONSE URL:",
        response.url
      );


      if (!response.ok) {

        throw new Error(
          `HTTP error ${response.status}`
        );

      }


      const text =
        await response.text();


      console.log(
        "RAW API RESPONSE:",
        text
      );


      let data;


      try {

        data =
          JSON.parse(text);

      } catch (jsonError) {

        console.error(
          "JSON PARSE ERROR:",
          jsonError
        );


        throw new Error(
          "API did not return valid JSON"
        );

      }


      console.log(
        "PARSED API RESPONSE:",
        data
      );


      // ========================================================
      // API ERROR
      // ========================================================

      if (data.error) {

        setError(
          data.message ||
          "Server error"
        );

        return;

      }


      // ========================================================
      // RESULT NOT FOUND
      // ========================================================

      if (!data.found) {

        setError(
          data.message ||
          "Result not found"
        );

        return;

      }


      // ========================================================
      // STUDENT INFORMATION
      // ========================================================

      setStudent(
        data.student || null
      );


      // ========================================================
      // ALL YEAR / COURSE RESULTS
      // ========================================================

      setResults(
        data.results || []
      );


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

    if (
      event.key === "Enter"
    ) {

      handleSearch();

    }

  };


  // ============================================================
  // UI
  // ============================================================

  return (

    <div
      className="
        min-h-screen
        bg-slate-100
      "
    >

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


          {/* ====================================================
              ACADEMY SELECT
          ==================================================== */}

          <div
            className="mb-4 relative"
            ref={academyRef}
          >

            <label
              className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-2
              "
            >
              Academy
            </label>


            {/* TRIGGER */}

            <button
              type="button"
              onClick={() => {
                setAcademyOpen((open) => !open);
              }}
              disabled={loading}
              aria-haspopup="listbox"
              aria-expanded={academyOpen}
              className="
                w-full
                flex
                items-center
                justify-between
                gap-3
                border
                border-gray-300
                rounded-lg
                p-2.5
                bg-white
                text-left
                transition-colors
                hover:border-indigo-400
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
                disabled:bg-gray-100
                disabled:cursor-not-allowed
              "
            >

              <span
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <span
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-indigo-50
                    text-indigo-600
                  "
                >
                  <selectedAcademy.icon
                    className="h-5 w-5"
                    strokeWidth={1.75}
                  />
                </span>

                <span className="font-medium text-gray-900">
                  {selectedAcademy.name}
                </span>

              </span>

              <ChevronDown
                className={`
                  h-5 w-5 text-gray-400 transition-transform
                  ${academyOpen ? "rotate-180" : ""}
                `}
              />

            </button>


            {/* LIST */}

            {academyOpen && (

              <div
                role="listbox"
                className="
                  absolute
                  z-10
                  mt-2
                  w-full
                  rounded-xl
                  border
                  border-gray-100
                  bg-white
                  py-1.5
                  shadow-xl
                  shadow-indigo-950/10
                  animate-[dropdown-in_0.15s_ease-out]
                "
              >

                {ACADEMIES.map((item) => {

                  const Icon = item.icon;
                  const isSelected = item.id === academy;

                  return (

                    <button
                      key={item.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {

                        setAcademy(item.id);
                        setStudent(null);
                        setResults([]);
                        setError("");
                        setAcademyOpen(false);

                      }}
                      className={`
                        w-full
                        flex
                        items-center
                        gap-3
                        px-3
                        py-2.5
                        text-left
                        transition-colors
                        ${isSelected
                          ? "bg-indigo-50"
                          : "hover:bg-gray-50"
                        }
                      `}
                    >

                      <span
                        className={`
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          transition-colors
                          ${isSelected
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-500"
                          }
                        `}
                      >
                        <Icon
                          className="h-5 w-5"
                          strokeWidth={1.75}
                        />
                      </span>

                      <span
                        className={`
                          flex-1
                          font-medium
                          ${isSelected
                            ? "text-indigo-700"
                            : "text-gray-700"
                          }
                        `}
                      >
                        {item.name}
                      </span>

                      {isSelected && (
                        <Check
                          className="h-4 w-4 text-indigo-600"
                          strokeWidth={2.5}
                        />
                      )}

                    </button>

                  );

                })}

              </div>

            )}

          </div>


          {/* ====================================================
              ENROLLMENT + SEARCH
          ==================================================== */}

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

                setEnrolNo(
                  event.target.value
                );

              }}
              onKeyDown={
                handleKeyDown
              }
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
              bg-white
              rounded-2xl
              shadow-lg
              mt-8
              py-12
              px-6
              flex
              flex-col
              items-center
              justify-center
            "
          >

            <div
              className="
                relative
                flex
                h-20
                w-20
                items-center
                justify-center
              "
            >

              <Loader2
                className="
                  h-20
                  w-20
                  animate-spin
                  text-indigo-600
                "
                strokeWidth={1.5}
              />


              <Shirt
                className="
                  absolute
                  h-7
                  w-7
                  text-amber-500
                "
                strokeWidth={1.75}
              />

            </div>


            <p
              className="
                mt-6
                text-lg
                font-semibold
                bg-linear-to-r
                from-indigo-600
                via-amber-500
                to-indigo-600
                bg-size-[200%_auto]
                bg-clip-text
                text-transparent
                animate-[shimmer-text_2.2s_linear_infinite]
              "
            >
              Tailoring your results
            </p>


            <div
              className="
                mt-3
                flex
                gap-1.5
              "
            >

              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-indigo-500
                  animate-[fade-dot_1.4s_ease-in-out_infinite]
                "
              />


              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-amber-500
                  animate-[fade-dot_1.4s_ease-in-out_infinite]
                  [animation-delay:0.2s]
                "
              />


              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-indigo-500
                  animate-[fade-dot_1.4s_ease-in-out_infinite]
                  [animation-delay:0.4s]
                "
              />

            </div>

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
                {student?.name ||
                  results[0]?.name ||
                  "Student"}
              </h2>


              <p
                className="
                  text-gray-500
                  mt-1
                "
              >
                Enrol No:{" "}

                {student?.enrol_no ||
                  results[0]?.enrol_no ||
                  enrolNo}

              </p>

            </div>


            {/* ==================================================
                ALL COURSE / YEAR RESULTS
            ================================================== */}

            {results.map(
              (result, index) => (

                <div
                  key={
                    `${result.course}-${result.year}-${index}`
                  }
                  className="
                    bg-white
                    rounded-2xl
                    shadow-lg
                    overflow-hidden
                  "
                >

                  {/* ==========================================
                      COURSE + YEAR
                  ========================================== */}

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
                      {result.course}
                    </p>


                    <h3
                      className="
                        text-2xl
                        font-bold
                        mt-1
                        text-gray-900
                      "
                    >
                      {result.year}
                    </h3>

                  </div>


                  {/* ==========================================
                      SUBJECTS
                  ========================================== */}

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

                        {result.subjects?.map(
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
                                  text-gray-700
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


                  {/* ==========================================
                      TOTAL + PASS
                  ========================================== */}

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


                      <div
                        className="
                          flex
                          flex-col
                          items-end
                        "
                      >

                        <span
                          className="
                            font-bold
                            text-xl
                            text-gray-900
                          "
                        >
                          {result.total}
                        </span>


                        <span
                          className="
                            mt-1
                            text-sm
                            font-bold
                            text-green-600
                          "
                        >
                          {result.status ||
                            "PASS"}
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </main>

    </div>

  );

}