const apiUrl = "http://localhost:3000/employees";

document
  .getElementById("employeeForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const position = document.getElementById("position").value;
    const salary = document.getElementById("salary").value;

    await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, position, salary }),
    });

    loadEmployees();
    e.target.reset();
  });

async function loadEmployees() {
  const response = await fetch(apiUrl);
  const employees = await response.json();

  const employeeList = document.getElementById("employeeList");
  employeeList.innerHTML = "";
  employees.forEach((emp) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${emp.id}</td>
            <td>${emp.name}</td>
            <td>${emp.position}</td>
            <td>${emp.salary}</td>
            <td><button onclick=\"deleteEmployee(${emp.id})\">Excluir</button></td>
        `;
    employeeList.appendChild(row);
  });
}

async function deleteEmployee(id) {
  await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
  loadEmployees();
}

loadEmployees();
