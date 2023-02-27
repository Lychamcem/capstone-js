getProducts();

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
  const product = {
    name: getElement("#ProductName").value,
    img: getElement("#ProductImage").value,
    price: getElement("#ProductPrice").value,
    description: getElement("#ProductDescription").value,
    price: getElement("#ProductType").value,
  };

  apiCreateProduct(product)
    .then((response) => {
      getProducts();
    })
    .catch((error) => {
      alert("Thêm sản phẩm thất bại");
    });
}

// DELETE PRODUCT
function deleteProduct(productId) {
  apiDeleteProduct(productId)
    .then(() => {
      getProducts();
    })

    .catch(() => {
      alert("Xóa sản phẩm thất bại");
    });
}

// Hàm lấy chi tiết 1 sản phẩm và hiển thị lên modal
function selectProduct(productId) {
  apiGetProductById(productId)
    .then((response) => {
      const product = response.data;
      getElement("#ProductName").value = product.name;
      getElement("#ProductImage").value = product.img;
      getElement("#ProductPrice").value = product.price;
      getElement("#ProductDescription").value = product.description;
      getElement("#ProductType").value = product.type;

      // Mở và cập nhật giao diện cho modal
      getElement(".modal-title").innerHTML = "Update Product";
      getElement(".modal-footer").innerHTML = `
        <button class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        <button class="btn btn-primary" onclick="updateProduct('${product.id})">Update</button>
      `;
      $("#myModal").modal("show");
    })
    .catch((error) => {
      alert("Lấy chi tiết sản phẩm thất bại");
    });
}

// UPDATE PRODUCT
function updateProduct(productId) {
  const product = {
    name: getElement("#ProductName").value,
    img: getElement("#ProductImage").value,
    price: getElement("#ProductPrice").value,
    description: getElement("#ProductDescription").value,
    type: getElement("#ProductType").value,
  };

  apiUpdateProduct(productId)
    .then((respone) => {
      getProducts();
    })
    .catch((error) => {
      alert("Cập nhật sản phẩm thất bại");
    });
}

// RENDER PRODUCT ON TABLE
function renderProducts(products) {
  let html = products.reduce((result, product, index) => {
    return (
      result +
      `
      <tr>
        <td>${index + 1}</td>
        <td>${product.name}</td>
        <td>${product.price}</td>
        <td>
          <img src="${product.img}" with="70" height="70" />
        </td>
        <td>${product.description}</td>
        <td>
          <button class="btn btn-primary"
          onclick="selectProduct('${product.id}')">
          Xem
          </button>
          <button class="btn btn-danger"
          data-toggle="modal"
          data-target="#myModal"
          onclick="deleteProduct('${product.id}')">
          Xoá
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
  getElement(".modal-title").innerHTML = "Adding Product";
  getElement(".modal-footer").innerHTML = `
  <button id="AddProduct" type="submit" class="btn btn-primary btn-green">Add</button>
  <button type="button" class="btn btn-secondary btn-red" data-bs-dismiss="modal">Close</button>
    `;
});

// Helpers
function getElement(selector) {
  return document.querySelector(selector);
}
