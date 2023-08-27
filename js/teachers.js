import request from "./main.js";
import { LIMIT } from "./const.js";

const teachersRow = document.querySelector(".teachers-row");
const PgTeacher = document.querySelector(".teacher-pg");
const TeacherCount = document.querySelector(".teacher-count");
const searchInputheader = document.querySelector(".input-search");
const addteacherBtn = document.querySelector(".add-category-btn");
const addSaveTeacherBtn = document.querySelector(".add-save-category-btn");
const teacherForm = document.querySelector(".teacher-form");
const teacherModal = document.querySelector("#category-modal");
const students = document.querySelector(".Students");
const selectTeacher = document.querySelector(".select-teachers");
const SortLastName = document.querySelector(".sort-lastName");

let selected = null;
let search = "";
let activePage = 1;
let married;
let nameOrder;

function getTeachersCard({
  firstname,
  lastName,
  avatar,
  id,
  email,
  phoneNumber,
  isMarried,
  birthday,
}) {
  return `<div class="card-teachers">
  <img src="${avatar}" class="card-img-top" alt="${firstname}">
  <div class="card-body d-flex flex-column align-items-center gap-3">
    <a href="">${firstname} ${lastName}</a>
    <p> ${birthday.split("T")[0]} </p>
    <a href="mailto:${email}">${email}</a>
    <a href="tel:${phoneNumber}">${phoneNumber}</a>
    <a>isMarried: ${isMarried ? "Yes" : "No"}</a>
    <div class="d-flex gap-3"><button id="${id}" class="btn btn-success w-100 edit-btn" data-bs-toggle="modal" data-bs-target="#category-modal">Edit</button>
    <button  id="${id}" class="btn btn-danger  w-100 delete-btn">Delete</button>
    <a href="students.html?students=${id}" class="btn  w-100 btn-warning">students</a></div>
  </div>
</div>`;
}
async function getTeachersRow() {
  try {
    teachersRow.innerHTML = `<div class="ring">Loading
                                <span class="span"></span>
                            </div>`;
    PgTeacher.innerHTML = "";
    TeacherCount.innerHTML = "";
    let params = { firstname: search };
    let paramsWithPagination = {
      isMarried: married,
      firstname: search,
      page: activePage,
      limit: LIMIT,
      // sortBy: "lastName",
      // order: nameOrder,
    };
    //  with search

    let { data } = await request.get("Teacher", { params });

    // with pagination

    let { data: TeachersAll } = await request.get("Teacher", {
      params: paramsWithPagination,
      isMarried: married,
    });

    // pg
    let pages = Math.ceil(data.length / LIMIT);

    PgTeacher.innerHTML = `<li class="page-item ${
      activePage === 1 ? "disabled" : ""
    }">
      <button page="-" class="page-link">Previous</button>
    </li>`;

    for (let i = 1; i <= pages; i++) {
      PgTeacher.innerHTML += `
        <li class="page-item ${
          i === activePage ? "active" : ""
        }"><button page="${i}" class="page-link">${i}</button></li>
      `;
    }

    PgTeacher.innerHTML += `<li class="page-item ${
      activePage === pages ? "disabled" : ""
    }">
      <button page="+" class="page-link">Next</button>
    </li>`;

    TeacherCount.textContent = `Total: ${data.length}`;
    teachersRow.innerHTML = "";

    if(data.length === 0) {
    TeacherCount.textContent = `No Teachers`;
    }else {
      TeachersAll.map((res) => {
        teachersRow.innerHTML += getTeachersCard(res);
      });
    }

  } catch (err) {
    console.log(err);
  }
}

getTeachersRow();

searchInputheader.addEventListener("keyup", function () {
  activePage = 1;
  search = this.value;
  getTeachersRow();
});

PgTeacher.addEventListener("click", (e) => {
  let page = e.target.getAttribute("page");
  if (page !== null) {
    if (page === "+") {
      activePage++;
    } else if (page === "-") {
      activePage--;
    } else {
      activePage = +page;
    }
  }
  getTeachersRow();
});

addteacherBtn.addEventListener("click", () => {
  selected = null;
  teacherForm.firstname.value = "";
  teacherForm.image.value = "";
  teacherForm.phoneNumber.value = "";
  teacherForm.email.value = "";
  teacherForm.birthday.value = "";
  teacherForm.isMarried.checked = "";
  teacherForm.lastName.value = "";
  addSaveTeacherBtn.textContent = "Add category";
});

teacherForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  let teacherData = {
    avatar: image.value,
    birthday: birthday.value.split("T")[0],
    email: email.value,
    firstname: firstname.value,
    phoneNumber: phoneNumber.value,
    isMarried: isMarried.checked,
    lastName: lastName.value,
  };
  console.log(teacherData);
  if (selected === null) {
    await request.post("Teacher", teacherData);
  } else {
    await request.put(`Teacher/${selected}`, teacherData);
  }
  getTeachersRow();
  bootstrap.Modal.getInstance(teacherModal).hide();
});

window.addEventListener("click", async (e) => {
  let id = e.target.getAttribute("id");
  let checkEdit = e.target.classList.contains("edit-btn");
  if (checkEdit) {
    selected = id;
    let { data } = await request.get(`Teacher/${id}`);
    teacherForm.firstname.value = data.firstname;
    teacherForm.image.value = data.avatar;
    teacherForm.phoneNumber.value = data.phoneNumber;
    teacherForm.email.value = data.email;
    teacherForm.birthday.value = data.birthday.split("T")[0];
    teacherForm.isMarried.checked = data.isMarried;
    teacherForm.lastName.value = data.lastName;

    addSaveTeacherBtn.textContent = "Save category";
  }

  let checkDelete = e.target.classList.contains("delete-btn");
  if (checkDelete) {
    let deleteConfirm = confirm("Do you want to delete this category?");
    if (deleteConfirm) {
      await request.delete(`Teacher/${id}`);
      getTeachersRow();
    }
  }
});

selectTeacher.addEventListener("change", function () {
  married = this.value;
  getTeachersRow();
});

// SortLastName.addEventListener("change", function () {
//   let res = SortLastName.value;
//   nameOrder = res === "asc" ? "asc" : res === "desc" ? "desc" : "";
//   getTeachersRow();
// });
