// src/Dashboard.js
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./styles.css";

// Only do this here, no need to import from another file like './lib/supabase'
const supabaseUrl = "https://fzoiztpqlkrcmoarewem.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6b2l6dHBxbGtyY21vYXJld2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwMTE3NDUsImV4cCI6MjA1MzU4Nzc0NX0.WweI_RHkx0bRi1ngTK2Oe4SHlKSSSTV9UQNXypBiaU4";
const supabase = createClient(supabaseUrl, supabaseKey);

function Dashboard() {
  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredBySearch = filteredTournaments.filter((t) =>
    Object.values(t).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const sortedTournaments = [...filteredTournaments].sort((a, b) => {
    if (sortOrder === "asc") {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    } else {
      return a[sortBy] < b[sortBy] ? 1 : -1;
    }
  });

  useEffect(() => {
    fetchTournaments();
  }, []);

  async function fetchTournaments() {
    const { data, error } = await supabase
      .from("PG-Shirt-Preorders")
      .select("*")
      .order("tournament", { ascending: true });

    if (error) console.error("Error:", error);
    else {
      setTournaments(data);
      setFilteredTournaments(data); // Set the initial filtered tournaments
    }
  }

  function handleFilter(tournament) {
    setSelectedTournament(tournament);
    if (tournament === "") {
      setFilteredTournaments(tournaments); // Reset filter
    } else {
      const filteredData = tournaments.filter((t) =>
        t.tournament?.includes(tournament)
      );
      setFilteredTournaments(filteredData);
    }
  }

  function getTotal(design, amt) {
    const price = [25, 25, 25, 20, 20, 20]; // array of prices for each design
    const designIndex = parseInt(design.split(" ")[1]) - 1; //Get the # from the Design column
    return amt * price[designIndex];
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Pre-Order Dashboards</h1>

      {/* Filter buttons for Tournament */}
      <div className="filter-buttons">
        <button
          className={`filter-btn ${selectedTournament === "" ? "active" : ""}`}
          onClick={() => handleFilter("")}
        >
          All Tournaments
        </button>
        <button
          className={`filter-btn ${
            selectedTournament === "Honolulu Diamond Classic" ? "active" : ""
          }`}
          onClick={() => handleFilter("Honolulu Diamond Classic")}
        >
          Honolulu Diamond Classic
        </button>
        <button
          className={`filter-btn ${
            selectedTournament === "Island Baseball Classic" ? "active" : ""
          }`}
          onClick={() => handleFilter("Island Baseball Classic")}
        >
          Island Baseball Classic
        </button>
        <button
          className={`filter-btn ${
            selectedTournament === "Paradise Championship" ? "active" : ""
          }`}
          onClick={() => handleFilter("Paradise Championship")}
        >
          Paradise Championship
        </button>
        <button
          className={`filter-btn ${
            selectedTournament === "Oahu Summer Classic" ? "active" : ""
          }`}
          onClick={() => handleFilter("Oahu Summer Classic")}
        >
          Oahu Summer Classic
        </button>
        <button
          className={`filter-btn ${
            selectedTournament === "Hawaii Baseball Classic" ? "active" : ""
          }`}
          onClick={() => handleFilter("Hawaii Baseball Classic")}
        >
          Hawaii Baseball Classic
        </button>
        <button
          className={`filter-btn ${
            selectedTournament === "Kurt Suzuki Maui Classic" ? "active" : ""
          }`}
          onClick={() => handleFilter("Kurt Suzuki Maui Classic")}
        >
          Kurt Suzuki Maui Classic
        </button>
        <button
          className={`filter-btn ${
            selectedTournament === "Holiday Baseball Bash" ? "active" : ""
          }`}
          onClick={() => handleFilter("Holiday Baseball Bash")}
        >
          Holiday Baseball Bash
        </button>
        <button
          className={`filter-btn ${
            selectedTournament === "Santa VS The Grinch Showdown"
              ? "active"
              : ""
          }`}
          onClick={() => handleFilter("Santa VS The Grinch Showdown")}
        >
          Santa VS the Grinch Showdown
        </button>
      </div>

      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />

      {/* Table to display data */}
      <div className="table-wrapper">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("name")}>
                Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("email")}>
                Email {sortBy === "email" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("design")}>
                Design{" "}
                {sortBy === "design" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("size")}>
                Size {sortBy === "size" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("quantity")}>
                Quantity{" "}
                {sortBy === "quantity" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("tournament")}>
                Tournament Pick-Up{" "}
                {sortBy === "tournament" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {sortedTournaments.length > 0 ? (
              sortedTournaments.map((t) => (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td>{t.email}</td>
                  <td>{t.design}</td>
                  <td>{t.size}</td>
                  <td>{t.quantity}</td>
                  <td>{t.tournament}</td>
                  <td>${getTotal(t.design, t.quantity).toFixed(2)}</td>{" "}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
