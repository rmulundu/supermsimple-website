const form = document.getElementById('teacher-login-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  if (username === 'teacher' && password === 'password') {
    window.open('(link unavailable)', '_blank');
  } else {
    alert('Invalid username or password');
  }
});
const enrollmentForm = document.getElementById('enrollment-form');
const marksListUL = document.getElementById('marks-list-ul');
const marksList = []; // New array to store marks

enrollmentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const studentName = document.getElementById('student-name-input').value;
  const subject = document.getElementById('subject-input').value;
  const assessmentType = document.getElementById('assessment-type-input').value;
  
  // Enrollment and marking logic
  const marks = prompt(`Enter marks for ${studentName} in ${subject} (${assessmentType}):`);
  const markList = {
    student: studentName,
    subject: subject,
    assessmentType: assessmentType,
    marks: marks
  };
  
  marksList.push(markList); // Add markList to the array
  
  // Append markList to the list
  const markListItem = document.createElement('LI');
  markListItem.textContent = `${studentName} - ${subject} (${assessmentType}): ${marks}`;
  marksListUL.appendChild(markListItem);
});

// New function to calculate average marks
function calculateAverageMarks(studentName) {
  const studentMarks = marksList.filter(mark => mark.student === studentName);
  const averageMarks = studentMarks.reduce((acc, current) => acc + parseInt(current.marks), 0) / studentMarks.length;
  return averageMarks;
}
// ...

// New function to display average marks
function displayAverageMarks() {
  const averageMarksList = document.getElementById('average-marks-ul');
  marksList.forEach(mark => {
    const studentName = mark.student;
    const averageMarks = calculateAverageMarks(studentName);
    const averageMarkListItem = document.createElement('LI');
    averageMarkListItem.textContent = `${studentName}: ${averageMarks}`;
    averageMarksList.appendChild(averageMarkListItem);
  });
}

// Call the displayAverageMarks function
displayAverageMarks();
const searchInput = document.getElementById('student-search-input');
const searchBtn = document.getElementById('search-btn');
const searchResultDiv = document.getElementById('search-result');

searchBtn.addEventListener('click', () => {
  const searchQuery = searchInput.value.toLowerCase();
  const foundMarks = marksList.find(mark => mark.student.toLowerCase() === searchQuery);
  if (foundMarks) {
    searchResultDiv.textContent = `Marks for ${foundMarks.student}: ${foundMarks.marks}`;
  } else {
    searchResultDiv.textContent = 'Student not found';
  }
});
// Existing code

// Add event listener to delete buttons
document.querySelectorAll('.delete-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const studentName = btn.previousSibling.textContent;
    const foundIndex = marksList.findIndex(mark => mark.student === studentName);
    if (foundIndex !== -1) {
      marksList.splice(foundIndex, 1);
      btn.parentNode.remove();
    }
  });
});
// Existing code

// Add event listener to update buttons
document.querySelectorAll('.update-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const studentName = btn.previousSibling.previousSibling.textContent;
    const foundIndex = marksList.findIndex(mark => mark.student === studentName);
    if (foundIndex !== -1) {
      const newMarks = prompt(`Enter new marks for ${studentName}:`);
      marksList[foundIndex].marks = newMarks;
      btn.parentNode.textContent = `${studentName} - ${newMarks}`;
    }
  });
});

const sortBtn = document.getElementById('sort-btn');

sortBtn.addEventListener('click', () => {
  marksList.sort((a, b) => {
    if (a.student < b.student) return -1;
    if (a.student > b.student) return 1;
    return 0;
  });
  const sortedList = marksList.map(mark => `${mark.student} - ${mark.marks}`);
  document.getElementById('marks-list-ul').innerHTML = '';
  sortedList.forEach(mark => {
    const markListItem = document.createElement('LI');
    markListItem.textContent = mark;
    document.getElementById('marks-list-ul').appendChild(markListItem);
  });
});
const printBtn = document.getElementById('print-btn');

printBtn.addEventListener('click', () => {
  const printWindow = window.open('', '', 'width=800,height=600');
  const printDocument = printWindow.document;

  printDocument.write('<html><body>');
  printDocument.write('<h1>Student Results</h1>');
  printDocument.write('<table>');

  // Add table headers
  printDocument.write('<tr><th>Student Name</th><th>Subject</th><th>Assessment Type</th><th>Marks</th></tr>');

  // Add table data
  marksList.forEach(mark => {
    printDocument.write(`<tr><td>${mark.student}</td><td>${mark.subject}</td><td>${mark.assessmentType}</td><td>${mark.marks}</td></tr>`);
  });

  printDocument.write('</table>');
  printDocument.write('</body></html>');

  printWindow.print();
});
// Select HTML elements
const generateReportCardBtn = document.getElementById('generate-report-card-btn');
const reportCardContainer = document.getElementById('report-card-container');

// Add event listener
generateReportCardBtn.addEventListener('click', generateReportCard);

// Define functions
function generateReportCard() {
  const studentName = prompt('Enter student name:');
  const studentMarks = getStudentMarks(studentName);
  const reportCardHTML = createReportCardHTML(studentMarks, studentName);
  reportCardContainer.innerHTML = reportCardHTML;
}

function getStudentMarks(studentName) {
  return marksList.filter(mark => mark.student === studentName);
}

function createReportCardHTML(studentMarks, studentName) {
  const averageMarks = calculateAverageMarks(studentMarks);
  const strongestSubject = getStrongestSubject(studentMarks);
  const weakestSubject = getWeakestSubject(studentMarks);
  const suggestionsForImprovement = getSuggestionsForImprovement(studentMarks);

  return `
    <h3>Report Card for ${studentName}</h3>
    <table>${createTableHTML(studentMarks)}</table>
    <h3>Summary:</h3>
    <p>Average Marks: ${averageMarks}</p>
    <p>Strongest Subject: ${strongestSubject}</p>
    <p>Weakest Subject: ${weakestSubject}</p>
    <p>Suggestions for Improvement: ${suggestionsForImprovement}</p>
  `;
}

function createTableHTML(studentMarks) {
  return studentMarks.map(mark => `
    <tr>
      <td>${mark.subject}</td>
      <td>${mark.assessmentType}</td>
      <td>${mark.marks}</td>
      <td>${getGrade(mark.marks)}</td>
    </tr>
  `).join('');
}

function calculateAverageMarks(studentMarks) {
  return studentMarks.reduce((acc, mark) => acc + mark.marks, 0) / studentMarks.length;
}

function getStrongestSubject(studentMarks) {
  return studentMarks.reduce((acc, mark) => {
    if (mark.marks > acc.marks) return mark;
    return acc;
  }, { marks: 0 }).subject;
}

function getWeakestSubject(studentMarks) {
  return studentMarks.reduce((acc, mark) => {
    if (mark.marks < acc.marks) return mark;
    return acc;
  }, { marks: 100 }).subject;
}

function getSuggestionsForImprovement(studentMarks) {
  return studentMarks.reduce((acc, mark) => {
    if (mark.marks < 60) {
      acc.push(`Improve in ${mark.subject}`);
    }
    return acc;
  }, []).join(', ');
}

function getGrade(marks) {
  if (marks >= 90) return 'A';
  if (marks >= 80) return 'B';
  if (marks >= 70) return 'C';
  if (marks >= 60) return 'D';
  return 'F';
}