import request from "./main.js";

const queryUrl = new URLSearchParams(location.search);
const IDteacher = queryUrl.get("students");
const StudentsRow = document.querySelector(".studenst-row");
const TeacherCount = document.querySelector(".teacher-count");
const searchInput = document.querySelector(".input-search");
const addstudentBtn = document.querySelector(".add-student-btn");
const StudentForm = document.querySelector(".student-form");
const SaveStudent = document.querySelector(".add-save-student-btn");
const teacherModal = document.querySelector("#category-modal");
const selectteacher = document.querySelector(".select-birhtday");
const selectTeacherFilter = document.querySelector(".select-teacher");
const btnsearch = document.querySelector(".btn-search");

btnsearch.addEventListener("click", (e) => {
  e.preventDefault();
});

let age = "";
let selected = null;

function getStudentsCard({
  firstName,
  lastName,
  avatar,
  id,
  email,
  phoneNumber,
  isMarried,
  isWork,
  groups,
  birthday,
}) {
  return `<div class="card-teachers">
  <img src="${avatar}" class="card-img-top" alt="">
  <div class="card-body">
    <a href="../students.html">${firstName} ${lastName}</a>
    <p> ${birthday.split("T")[0]}</p>
    <a href="mailto:${email}">${email}</a>
    <a href="tel:${phoneNumber}">${phoneNumber}</a>
    <a>isMarried: ${isMarried ? "Yes" : "No"}</a>
    <a>isWork: ${isWork ? "Yes" : "No"}</a>
    <div class="d-flex gap-3 align-items-center">
    <button id="${id}" class="btn w-100 btn-success m-3 edit-btn" data-bs-toggle="modal" data-bs-target="#category-modal">Edit</button>
    <button  id="${id}" class="btn w-100 btn-danger delete-btn">Delete</button></div>
  </div>
</div>`;
}
let search = "";

async function getStudentsRow(teacherId = IDteacher) {
  try {
    StudentsRow.innerHTML = `<span class="loader"></span>`;
    TeacherCount.innerHTML = ``;
    let params = {
      firstName: search,
      sortBy: "birthday",
      order: age,
    };

    let { data } = await request.get(`Teacher/${teacherId}/student`, {
      params,
    });
    TeacherCount.textContent = `Total: ${data.length}`;
    StudentsRow.innerHTML = ``;

    if (data.length === 0) {
      TeacherCount.innerHTML = "No students";
    } else {
      data.map((res) => {
        StudentsRow.innerHTML += getStudentsCard(res);
      });
    }
  } catch (err) {
    console.log(err);
  }
}

searchInput.addEventListener("keyup", function () {
  search = this.value;
  getStudentsRow();
});

getStudentsRow();

addstudentBtn.addEventListener("click", () => {
  selected = null;
  StudentForm.firstname.value = "";
  StudentForm.image.value = "";
  StudentForm.phoneNumber.value = "";
  StudentForm.email.value = "";
  StudentForm.birthday.value = "";
  StudentForm.isMarried.checked = "";
  StudentForm.lastName.value = "";
  SaveStudent.textContent = "Add category";
});

StudentForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  let studentData = {
    avatar: image.value,
    birthday: birthday.value.split("T")[0],
    email: email.value,
    firstName: firstname.value,
    isMarried: isMarried.checked,
    isWork: isWork.checked,
    lastName: lastName.value,
    phoneNumber: phoneNumber.value,
  };
  if (selected === null) {
    await request.post(`Teacher/${IDteacher}/student`, studentData);
  } else {
    await request.put(`Teacher/${IDteacher}/student/${selected}`, studentData);
  }
  getStudentsRow();
  bootstrap.Modal.getInstance(teacherModal).hide();
});

window.addEventListener("click", async (e) => {
  let id = e.target.getAttribute("id");
  let checkEdit = e.target.classList.contains("edit-btn");
  if (checkEdit) {
    selected = id;
    let { data } = await request.get(`Teacher/${IDteacher}/student/${id}`);
    StudentForm.firstname.value = data.firstName;
    StudentForm.image.value = data.avatar;
    StudentForm.phoneNumber.value = data.phoneNumber;
    StudentForm.email.value = data.email;
    StudentForm.birthday.value = data.birthday.split("T")[0];
    StudentForm.isMarried.checked = data.isMarried;
    StudentForm.isWork.checked = data.isWork;
    StudentForm.lastName.value = data.lastName;

    SaveStudent.textContent = "Save category";
  }

  let checkDelete = e.target.classList.contains("delete-btn");
  if (checkDelete) {
    let deleteConfirm = confirm("Do you want to delete this category?");
    if (deleteConfirm) {
      await request.delete(`Teacher/${IDteacher}/student/${id}`);
      getStudentsRow();
    }
  }
});

selectteacher.addEventListener("change", function () {
  let Filter = selectteacher.value;
  age = Filter === "asc" ? "asc" : Filter === "desc" ? "desc" : "";
  getStudentsRow();
});

async function getTeachersFilter() {
  try {
    const { data } = await request.get("Teacher");

    data.map((res) => {
      const option = document.createElement("option");
      option.value = res.id;
      option.textContent = res.firstname;
      selectTeacherFilter.appendChild(option);
    });
    
    selectTeacherFilter.value = IDteacher;
    selectTeacherFilter.addEventListener("change", function () {
      const selectedTeacherId = this.value;
      getStudentsRow(selectedTeacherId);
    });
  } catch (error) {
    console.error(error);
  }
}

getTeachersFilter();
