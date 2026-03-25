import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const res = await api.get("/admin/categories");
    setCategories(res.data.data);
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Categories</h2>

      {categories.map((cat) => (
        <div key={cat._id} className="bg-[#020617] p-4 mb-3 rounded">
          <h3 className="font-bold">{cat.name}</h3>

          {cat.problems.map((p, i) => (
            <p key={i}>{p.problemId?.title}</p>
          ))}
        </div>
      ))}
    </div>
  );
}