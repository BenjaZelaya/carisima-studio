import React, { useState } from "react";

const Admin = () => {

  const [service, setService] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    image: ""
  });

  const handleChange = (e) => {
    setService({
      ...service,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await fetch("http://localhost:5000/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(service)
      });

      const data = await res.json();

      console.log(data);

      alert("Servicio creado");

      setService({
        name: "",
        description: "",
        price: "",
        duration: "",
        image: ""
      });

    } catch (error) {
      console.error(error);
    }
  };

  return (

    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-xl shadow-lg w-[400px]"
      >

        <h2 className="text-2xl font-bold mb-6">Crear Servicio</h2>

        <input
          name="name"
          value={service.name}
          onChange={handleChange}
          placeholder="Nombre"
          className="w-full border p-3 mb-4"
        />

        <input
          name="price"
          value={service.price}
          onChange={handleChange}
          placeholder="Precio"
          className="w-full border p-3 mb-4"
        />

        <input
          name="duration"
          value={service.duration}
          onChange={handleChange}
          placeholder="Duración (minutos)"
          className="w-full border p-3 mb-4"
        />

        <input
          name="image"
          value={service.image}
          onChange={handleChange}
          placeholder="URL Imagen"
          className="w-full border p-3 mb-4"
        />

        <textarea
          name="description"
          value={service.description}
          onChange={handleChange}
          placeholder="Descripción"
          className="w-full border p-3 mb-4"
        />

        <button
          className="w-full bg-pink-500 text-white p-3 rounded"
        >
          Crear Servicio
        </button>

      </form>

    </div>
  );
};

export default Admin;