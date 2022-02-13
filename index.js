const csv = require("csv-parser");
const express = require("express");
const app = express();
const fs = require("fs");
const students = [];
const tests = [];
const marks = [];
const courses = [];

const readCsv = (filename) => {
  fs.createReadStream(__dirname + "/" + filename + ".csv")
    .pipe(csv())
    .on("data", (data) => {
      if (filename === "students") {
        students.push(data);
      } else if (filename === "tests") {
        tests.push(data);
      } else if (filename === "marks") {
        marks.push(data);
      } else if (filename === "courses") {
        courses.push(data);
      }
    })
    .on("end", () => {
      //Add courseAvg field to courses array
      students.forEach((student) => {
        const studentId = student.id;
        courses.forEach((course) => {
          const courseId = course.id;

          //Get all tests by courses
          const getAllTestsByCourse = tests.filter(
            (test) => test.course_id === courseId
          );
          console.log("*********************");
          console.log(getAllTestsByCourse);
          console.log("*********************");

          //Get actual marks by test id
          getAllTestsByCourse.forEach((allTest) => {
            const testIdInTestDb = allTest.id;

            const getMarksByTest = marks.filter(
              (test) =>
                test.test_id === testIdInTestDb && test.student_id === studentId
            );

            // Get total marks for the student
            const getTotalMarks = getMarksByTest.reduce((acc, curr) => {
              return acc + parseInt(curr.mark);
            }, 0);

            let totalAvg = Number(getTotalMarks) / getMarksByTest.length;

            course.courseAverage = totalAvg.toFixed(2);
          });

          // Get the marks for the student
          const getTotalmsk = marks.filter(
            (mark) => mark.student_id === studentId
          );

          // Get total marks for the student
          const getTotalMarks = getTotalmsk.reduce((acc, curr) => {
            return acc + parseInt(curr.mark);
          }, 0);

          // Get the average marks for the student
          let totalAvg = getTotalMarks / getTotalmsk.length;
          student.totalAverage = totalAvg.toFixed(2);
          student.courses = courses;
        });
      });
    });
  app.get("/csv", (req, res) => {
    res.json(students);
  });
};

readCsv("marks");
readCsv("students");
readCsv("tests");
readCsv("courses");

app.listen(8080, () => {
  console.log("server is running");
});
