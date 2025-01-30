const request = require("supertest");
const { app, server } = require("../index");

describe("Operaciones CRUD de cafes", () => {
    it("GET /cafes - Debería retornar un status code 200 y un arreglo con al menos 1 objeto", async () => {
        const response = await request(app).get("/cafes").send();
        console.log("GET /cafes response:", response.body);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it("DELETE /cafes/:id - Debería retornar un código 404 al intentar eliminar un café con un id inexistente", async () => {
        const idInexistente = 9999;
        const response = await request(app)
            .delete(`/cafes/${idInexistente}`)
            .set("Authorization", "Bearer token-valido")
            .send();
        console.log("DELETE /cafes/:id response:", response.body);
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toBe("No se encontró ningún cafe con ese id");
    });

    it("POST /cafes - Debería agregar un nuevo café y retornar un código 201", async () => {
        const nuevoCafe = { id: 5, nombre: "Latte" };
        const response = await request(app).post("/cafes").send(nuevoCafe);
        console.log("POST /cafes response:", response.body);
        expect(response.status).toBe(201);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toContainEqual(nuevoCafe);
    });

    it("PUT /cafes/:id - Debería retornar un código 400 si el ID en los parámetros no coincide con el ID en el payload", async () => {
        const idParametro = 1;
        const cafeActualizado = { id: 2, nombre: "Cortado Actualizado" };
        const response = await request(app)
            .put(`/cafes/${idParametro}`)
            .set("Authorization", "Bearer token-valido")
            .send(cafeActualizado);
        console.log("PUT /cafes/:id response:", response.body);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toBe("El id del parámetro no coincide con el id del café recibido");
    });

    afterAll(async () => {
        await new Promise((resolve) => server.close(resolve));
    });
});