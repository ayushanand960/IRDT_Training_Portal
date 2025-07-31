import React from "react";
import "./ZoneTable.css";
import eastZoneData from "../data/eastZoneData";
import westZoneData from "../data/westZoneData";
import centralZoneData from "../data/centralZoneData";
import bundelkhandZoneData from "../data/bundelkhandZoneData";
const ZoneTable = () => {
  const zones = [
    { title: "East Zone - VARANASI", data: eastZoneData },
    { title: "West Zone - DAURALA (MEERUT)", data: westZoneData },
     { title: "CENTRAL ZONE - LUCKNOW", data: centralZoneData },
      { title: "BUNDELKHAND ZONE :- JHANSI", data: bundelkhandZoneData },
    // 🔜 You can easily add North Zone, South Zone later
  ];

  return (
    <div className="zone-container">
      <div className="zone-header">POLYTECHNIC ZONES</div>

      {zones.map((zone, idx) => (
        <div key={idx} className="zone-section">
          <h2>{zone.title}</h2>
          <table className="zone-table">
            <thead>
              <tr>
                <th>Sl. No.</th>
                <th>Polytechnic Name & Address</th>
                <th>Available Courses</th>
                <th>Approved Seats for Year 2020-21</th>
              </tr>
            </thead>
            <tbody>
              <tr className="section-row">
                <td colSpan="4"><strong>Government Institutions</strong></td>
              </tr>
              {zone.data.map((item, index) => (
                <tr key={index}>
                  <td>{item.sn}</td>
                  <td>
                    <strong>{item.name}</strong>
                    <br />
                    Ph No. {item.phone}
                  </td>
                  <td className="available-courses">
                    {item.courses.map((course, i) => (
                      <p key={i}>{course}</p>
                    ))}
                  </td>
                  <td className="seat-numbers">
                    {item.seats.map((seat, i) => (
                      <p key={i}>{seat}</p>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ZoneTable;
