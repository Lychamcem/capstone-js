import {
  apiGetProducts,
  apiUpdateProduct,
  apiGetProductById,
  apiDeleteProduct,
  apiCreateProduct,
} from "../services/ProductAPI.js";
import Product from "../../Product.js";
import Swal from "../../node_modules/sweetalert2/src/sweetalert2.js";

getProducts();

// make global functions based on functions imported from ProductAPI
window.createProduct = createProduct;
window.deleteProduct = deleteProduct;
window.selectProduct = selectProduct;
window.updateProduct = updateProduct;
window.resetModal = resetModal;
window.searchProductName = searchProductName;

// REQUEST API
function getProducts(searchValue) {
  apiGetProducts(searchValue)
    .then((response) => {
      // Call API
      const products = response.data.map((product) => {
        return new Product(
          product.id,
          product.name,
          product.price,
          product.img,
          product.description
        );
      });
      renderProducts(response.data);
    })
    .catch((error) => {
      alert("API get products error");
    });
}

// ADDING PRODUCT
function createProduct() {
  let name = getElement("#ProductName").value.trim();
  let img = getElement("#ProductImage").value.trim();
  let price = getElement("#ProductPrice").value.trim();
  let description = getElement("#ProductDescription").value.trim();
  let type = getElement("#ProductType").value;

  if (!isValidated(name, img, price, description, type)) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please fill information again",
    });
    return;
  }

  //create a new product
  type = "1" ? "Indoor Plants" : "Outdoor Plants";
  price = (+price).toString();
  const product = {
    name,
    img,
    price,
    description,
    type,
  };

  apiCreateProduct(product)
    .then((data) => {
      getProducts();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Add new product successfully !",
        showConfirmButton: false,
        timer: 1500,
      });
    })
    .then(() => {
      getElement("#ProductName").value = "";
      getElement("#ProductImage").value = "";
      getElement("#ProductPrice").value = "";
      getElement("#ProductDescription").value = "";
      getElement("#ProductType").value = "";
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Fail to add a new product !",
      });
    });
}

// DELETE PRODUCT
function deleteProduct(productId) {
  //sweet alert animation
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success ms-1",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        //if confirmed to delete, call API
        apiDeleteProduct(productId)
          .then(() => {
            swalWithBootstrapButtons.fire(
              "Deleted!",
              "The product has been deleted.",
              "success"
            );
            getProducts();
          })
          .catch(() => {
            swalWithBootstrapButtons.fire(
              "Fail to delete",
              "Please try again",
              "error"
            );
          });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          "Cancelled",
          "The product is safe :)",
          "error"
        );
      }
    });
}

// H??m l???y chi ti???t 1 s???n ph???m v?? hi???n th??? l??n modal
function selectProduct(productId) {
  // M??? v?? c???p nh???t giao di???n cho modal
  getElement(".modal-title").innerHTML = "Update Product";
  getElement(".modal-footer").innerHTML = `
    <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
    <button class="btn btn-primary" onclick="window.updateProduct('${productId}')">Update</button>
  `;

  apiGetProductById(productId)
    .then((response) => {
      const product = response.data;
      getElement("#ProductName").value = product.name;
      getElement("#ProductImage").value = product.img;
      getElement("#ProductPrice").value = product.price;
      getElement("#ProductDescription").value = product.description;
      getElement("#ProductType").value =
        product.type === "Indoor Plants" ? 1 : 2;
    })
    .catch((error) => {
      alert("Fail to get information about product");
    });
}

// UPDATE PRODUCT
function updateProduct(productId) {
  let name = getElement("#ProductName").value.trim();
  let img = getElement("#ProductImage").value.trim();
  let price = getElement("#ProductPrice").value.trim();
  let description = getElement("#ProductDescription").value.trim();
  let type = getElement("#ProductType").value;

  if (!isValidated(name, img, price, description, type)) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please fill information again",
    });
    return;
  }

  //change information of product
  type = "1" ? "Indoor Plants" : "Outdoor Plants";
  price = (+price).toString();
  const product = {
    name,
    img,
    price,
    description,
    type,
  };

  apiUpdateProduct(productId, product)
    .then((response) => {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Update product successfully !",
        showConfirmButton: false,
        timer: 1500,
      });
      getProducts();
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Fail to update product !",
      });
    });
}

// RENDER PRODUCT ON TABLE
function renderProducts(products) {
  let html = products.reduce((result, product, index) => {
    return (
      result +
      `
      <tr>
        <th scope="row" class='fw-bold'>${index + 1}</th>
        <td>${product.name}</td>
        <td>$${product.price}</td>
        <td>
          <img src="${product.img}" with="70" height="70" />
        </td>
        <td>${product.description}</td>
        <td>
          <button class="btn btn-primary" 
          data-bs-toggle="modal"
          data-bs-target="#myModal"
          onclick="window.selectProduct('${product.id}')">
          Edit
          </button>
        </td>
        <td>
          <button class="btn btn-danger"
          onclick="window.deleteProduct('${product.id}')">
          Delete
          </button>
          </td>
      </tr>
    `
    );
  }, "");

  document.getElementById("ProductList").innerHTML = html;
}

// DOM
getElement("#AddProduct").addEventListener("click", () => {
  // reset modal
  getElement("#ProductName").value = "";
  getElement("#ProductImage").value = "";
  getElement("#ProductPrice").value = "";
  getElement("#ProductDescription").value = "";
  getElement("#ProductType").value = "";

  getElement(".modal-title").innerHTML = "Adding Product";
  getElement(".modal-footer").innerHTML = `
    <button id="addNewProduct" onclick="window.createProduct()" type="submit" class="btn-green">Add</button>
    <button type="button" class="btn-red" data-bs-dismiss="modal" onclick='window.resetModal()'>Close</button>
  `;
});

// SEARCH PRODUCT BY NAME
const ProductList = getProductList();
renderProducts(ProductList);

function searchProductName() {
  let search = getElement("#searchName").value;

  let newProductList = ProductList.filter((product) => {
    let name = product.name.toLowerCase();
    search = search.toLowerCase();
    return name, indexOf(search) !== -1;
  });

  // B3: G???i h??m renderTable ????? hi???n th??? ra giao di???n
  renderProducts(newProductList);
}

function getProductList() {
  const json = localStorage.getItem("ProductList");
  if (!json) {
    return [];
  }
  const productList = JSON.parse(json);
  for (let i = 0; i < productList.length; i++) {
    const product = productList[i];
    productList[i] = new product(
      product.id,
      product.name,
      product.email,
      product.password,
      product.dateOfBirth,
      product.course,
      product.math,
      product.physics,
      product.chemistry
    );
  }
  return ProductList;
}

// ARRANGE PRODUCT BY NAME
let arrangeProduct = product.name.sort();
console.log(arrangeProduct);
renderProducts(arrangeProduct);

// Helpers
function getElement(selector) {
  return document.querySelector(selector);
}

let modal;
document.addEventListener("click", (e) => {
  if (e.target.className === "modal-open") {
    modal = document.getElementById(e.target.dataset.id);
    openModal(modal);
  } else if (e.target.className === "modal-close") {
    closeModal(modal);
  } else {
    return;
  }
});

//reset Modal
function resetModal() {
  getElement("#nameError").classList.add("d-none");
  getElement("#ProductName").classList.remove("border-danger");
  getElement("#imageError").classList.add("d-none");
  getElement("#ProductImage").classList.remove("border-danger");
  getElement("#priceError").classList.add("d-none");
  getElement("#ProductPrice").classList.remove("border-danger");
  getElement("#descriptionError").classList.add("d-none");
  getElement("#ProductDescription").classList.remove("border-danger");
  getElement("#typeError").classList.add("d-none");
  getElement("#ProductType").classList.remove("border-danger");
}

//===========================================
// Validate

function isValidated(name, img, price, description, type) {
  let isValidated = true;
  //check name
  if (!name) {
    getElement("#nameError").classList.remove("d-none");
    getElement("#ProductName").classList.add("border-danger");
    isValidated = false;
  } else {
    getElement("#nameError").classList.add("d-none");
    getElement("#ProductImage").classList.remove("border-danger");
  }
  //check img
  if (!/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|webp)/.test(img)) {
    getElement("#imageError").classList.remove("d-none");
    getElement("#ProductImage").classList.add("border-danger");
    isValidated = false;
  } else {
    getElement("#imageError").classList.add("d-none");
    getElement("#ProductImage").classList.remove("border-danger");
  }
  //check price
  if (!/^\d+$/.test(price)) {
    getElement("#priceError").classList.remove("d-none");
    getElement("#ProductPrice").classList.add("border-danger");
    isValidated = false;
  } else {
    getElement("#priceError").classList.add("d-none");
    getElement("#ProductPrice").classList.remove("border-danger");
  }
  //check description
  if (!description) {
    getElement("#descriptionError").classList.remove("d-none");
    getElement("#ProductDescription").classList.add("border-danger");
    isValidated = false;
  } else {
    getElement("#descriptionError").classList.add("d-none");
    getElement("#ProductDescription").classList.remove("border-danger");
  }
  //check type
  if (!type) {
    getElement("#typeError").classList.remove("d-none");
    getElement("#ProductType").classList.add("border-danger");
    isValidated = false;
  } else {
    getElement("#typeError").classList.add("d-none");
    getElement("#ProductType").classList.remove("border-danger");
  }

  return isValidated;
}
