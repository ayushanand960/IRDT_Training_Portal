  import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RegisterTemplate({ role }) {
  const nav = useNavigate();

  // ✅ Step 1: Added state variables for category and subcategory
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const handleSubmit = (e) => {
  e.preventDefault();

  const form = e.target;
  const data = {
    role,
    ehrms: form[0].value,
    firstName: form[1].value,
    middleName: form[2].value,
    lastName: form[3].value,
    email: form[4].value,
    mobile: form[5].value,
    gender: form[6].value,
    polytechnic: form[7].value,
    branch: role === "Teaching Staff" ? form[8].value : "",
    experience: role === "Teaching Staff" ? form[9].value : "",
    designation: role === "Teaching Staff" ? form[10].value : "",
    category: role === "Teaching Staff" ? form[11].value : "",
    subcategory: role === "Teaching Staff" ? form[12].value : "",
    department: role !== "Teaching Staff" ? form[8].value : "",
    password: form[role === "Teaching Staff" ? 13 : 9].value
  };

  localStorage.setItem("user", JSON.stringify(data));
  alert("Registered successfully!");
  nav("/login");
};


  return (
    <>
      <Header />
      <div className="container my-5">
        <div className="mx-auto p-4 shadow rounded bg-white" style={{ maxWidth: '700px' }}>
          <h2 className="text-primary">{role} Registration</h2>
          <p className="text-muted mb-4">Create your IRDT Portal account</p>

     <form onSubmit={handleSubmit}>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <input type="text" className="form-control" placeholder="EHRMS Code" required />
              </div>
              <div className="col-md-6">
                <input type="text" className="form-control" placeholder="First Name" required />
              </div>
              <div className="col-md-6">
                    <input type="text" className="form-control" placeholder="Middle Name"  />
              </div>
               <div className="col-md-6">
                    <input type="text" className="form-control" placeholder="Last Name" />
              </div>
              <div className="col-md-6">
                <input type="email" className="form-control" placeholder="Email id" required />
              </div>
              <div className="col-md-6">
                <input type="tel" className="form-control" placeholder="Mobile no." required />
              </div>
               <div className="col-11">
                <select className="form-select" required>
                  <option> select gender</option>
                  <option>male</option>
                  <option>female</option>
                  <option>transgender</option>
</select></div>
              <div className="col-12">
                <select className="form-select" required>
                  <option>Select Polytechnic</option>
                   
 
 
  <option>1003 GOVT. POLYTECHNIC,JANSATH, MUZAFFAR NAGAR</option>
 
  <option>1004 GOVT. POLYTECHNIC,KUTANA, BARAUT, BAGHPAT</option>
 
  <option> 1006 GOVT. GIRLS POLYTECHNIC, ARNIYA,BULANDSHAHAR</option>
 
  <option> 1101 GOVT. POLYTECHNIC, GHAZIABAD</option>
 
   <option>1102 KM MAYAWATI GOVT. GIRLS POLYTECHNIC, BADALPUR, GAUTAMBUDDHA NAGAR</option>
 
 <option> 1103 SETH GANGASAGAR JATIA POLYTECHNIC, KHURJA, BULANDSHAHAR </option>

 <option>1104 GOVT. POLYTECHNIC, SAHARANPUR</option>
 
   <option>1105 SAVITRIBAI PHULE GOVT. GIRLS POLYTECHNIC, KUMARHERA, SAHARANPUR</option>
 
  <option>1106 GOVT. POLYTECHNIC, MORADABAD</option>
 
  <option> 1107 GOVT. GIRLS POLYTECHNIC, MORADABAD</option>
 
 
 <option>1108 GOVT. POLYTECHNIC, BIJNORE</option>
 
  <option> 1109 GOVT. POLYTECHNIC, RAMPUR</option>
 
 <option> 1110 GOVT. POLYTECHNIC, MAINPURI</option>

 <option>1111 GOVT. POLYTECHNIC, SORON, KASGANJ</option>
 
   <option>1112 GOVT. GIRLS POLYTECHNIC, SHAMLI</option>
 
  <option> 1113 GOVT. LEATHER INSTITUTE, AGRA</option>
 
  <option>1114 GOVT. POLYTECHNIC, FIROZABAD</option>
 
 <option> 1133 CH. MUKHTAR SINGH GOVT. GIRLS POLYTECHNIC DAURALA,MEERUT</option>
 
  <option> 1137 MAHAMAYA POLYTECHNIC OF INFORMATION TECHNOLOGY, MAHAMAYA NAGAR, HATHRAS</option>
 
  <option>1138 MAHAMAYA POLYTECHNIC OF INFORMATION TECHNOLOGY, AMROHA</option>
 
   <option>1269 GOVT. POLYTECHNIC, SHAMSABAD, AGRA</option>
 
 <option> 1270 GOVT. POLYTECHNIC,THAKURDWARA, MORADABAD</option>
 
  <option>1271 GOVT. POLYTECHNIC,KISHNI, MAINPURI</option>
 
 <option> 1272 GOVT. POLYTECHNIC,CHAMRAUWA,RAMPUR</option>
 
   <option>1273 GOVT. POLYTECHNIC, KATAI JOYA, J P NAGAR</option>
 
 <option> 1609 GOVT. POLYTECHNIC,TUNDLA, FIROZABAD</option>
 
  <option> 1610 GOVT. POLYTECHNIC, CHANGIPUR, NOORPUR, BIJNORE</option>
 
 <option> 1611 GOVT. POLYTECHNIC, MANKERA, AGRA</option>
 
 <option>1612 GOVT. POLYTECHNIC, SUTAWALI, AMROHA</option>
 
  <option>1613 GOVT. POLYTECHNIC, SIKANDARARAO, ETAH</option>
 
  <option> 1614 GOVT. POLYTECHNIC, SHAHABAD, RAMPUR</option>
 
  <option>1615 GOVT. POLYTECHNIC, CHHACHHA, BHOGAON, MAINPURI</option>
 
 <option> 1646 GOVT. POLYTECHNIC , CHANDAUSI , MORADABAD</option>
 
   <option>1661 GOVT. POLYTECHNIC MAWANA KHURD MEERUT</option>
 
  <option> 1662 GOVT. POLYTECHNIC. KIRTHAL,CHAPRAULI, BAGHPAT</option>
 
   <option>1663 GOVT. POLYTECHNIC KOTVAN MATHURA</option>
 
  <option> 1664 GOVT. POLYTECHNIC DIBAI BULANDSHAHER</option>
 
   <option>1665 MAHAMAYA POLYTECHNIC OF INFORMATION TECHNOLOGY ALIGARH</option>
 
   <option>1692 M M I T, SHAMLI</option>
 
    <option>1693 GOVT. POLYTECHNIC,HINDALPUR,DHAHLANA,HAPUR</option>
 
 <option> 1694 M M I T, KAASGANJ</option>
 
   <option>2080 GOVT. GIRLS POLYTECHNIC, LUCKNOW</option>
 
  <option> 2124 GOVT. POLYTECHNIC, BACHHRAWAN, RAI BARELI</option>
 
  <option>2201 GOVT. POLYTECHNIC, LUCKNOW</option>
 
 <option> 2205 GOVT. POLYTECHNIC, FAIZABAD</option>
 
  <option>2206 ARYIKAGYANWATI, GOVT. GIRLS POLYTECHNIC, FAIZABAD</option>
 
 <option> 2207 CHHATRAPATI SHAHUJI MAHARAJ GOVT.POLY. AMBEDKARNAGAR</option>
 
  <option>2208 GOVT. POLYTECHNIC, BARABANKI</option>
 
   <option>2209 GOVT. POLYTECHNIC, GONDA</option>
 
   <option>2210 GOVT. POLYTECHNIC, BAHRAICH</option>
 
 
  <option> 2211 GOVT. GIRLS POLYTECHNIC, AMETHI</option>
 
 <option> 2212 GOVT. POLYTECHNIC, UNNAO</option>
 
 
   <option>2214 GOVT. POLYTECHNIC, HARDOI</option>
 
    <option>2215 GOVT. POLYTECHNIC, LAKHIMPUR KHERI</option>
 
  <option>2216 GOVT. POLYTECHNIC, BAREILLY</option>
 
  <option>2217 GOVT. GIRLS POLYTECHNIC, BAREILLY</option>
 
   <option>2218 GOVT. POLYTECHNIC, BUDAUN</option>
 
  <option>2219 GOVT. POLYTECHNIC, PILIBHIT</option>
 
  <option> 2220 GOVT. POLYTECHNIC, SHAHJAHANPUR</option>
 
 <option> 2221 SANJAY GANDHI GOVT. POLYTECHNIC, JAGDISHPUR, AMETHI</option>
 
  <option> 2228 GOVT. POLYTECHNIC, KURSI ROAD, FATEHPUR, BARABANKI</option>
 
 <option> 2230 GOVT. POLYTECHNIC, ADAMPUR, TARABGANJ, GONDA</option>
 
  <option> 2234 GOVT. POLYTECHNIC, MOHAMMADPUR, BAHRAICH</option>
 
   <option>2250 TATHAGAT GAUTAM BUDDHA GOVT. POLYTECHNIC, SHRAVASTI</option>
 
  <option> 2251 CHHATRAPATI SAHUJI MAHARAJ GOVT. POLYTECHNIC, BALRAMPUR</option>
 
  <option>2701 GOVT. POLYTECHNIC, ALAPUR, BUDAUN</option>
 
   <option>2702 GOVT. POLYTECHNIC, DEEH, SADAR, UNNAO</option>
 
 
   <option>2703 GOVT. POLYTECHNIC, PUWAYAN, SHAHJAHANPUR</option>
 
 
  <option>2712 GOVT. POLYTECHNIC,BAIJPUR,BHITI,AMBEDKAR NAGAR</option>
 
 
   <option>2717 GOVT. POLYTECHNIC KENAURA SULTANPUR</option>
 
 <option> 2718 MAHAMAYA POLYTECHNIC OF INFORMATION TECHNOLOGY SHARAVASTI</option>
 
  <option> 2719 GOVT. POLYTECHNIC ALIYA SITAPUR</option>
 
  <option> 2720 GOVT. POLYTECHNIC POORANPUR PILIBHIT</option>
 
  <option> 2721 GOVT. POLYTECHNIC BIGAPUR UNNAO</option>
 
  <option> 2737 GOVT. POLYTECHNIC,MOHAMMADI, LAKHIMPUR KHERI</option>
 
 <option>2738 GOVT. GIRLS POLYTECHNIC,TILHAR,SHAHJAHANPUR</option>
 
 <option> 2739 GOVT. POLYTECHNIC,JAMUNIA DEEH,HARAKH,BARABANKI</option>
 
   <option>2740 GOVT. GIRLS POLYTECHNIC,RISIYA,NANPARA,BAHARAICH</option>
 
 <option>2784 GOVT. POLYTECHNIC,SUMDA,SAHASWAN, BUDAUN</option>
 
  <option> 2785 GOVT. POLYTECHNIC, BAHERI,BAREILLY</option>
 
 <option> 3012 GOVT. POLYTECHNIC, KANPUR</option>
  
   <option>3043 GOVT. POLYTECHNIC,KULPAHAD, MAHOBA(PPP Mode) </option>
 
   <option>3301 GOVT. POLYTECHNIC, JHANSI</option>
 
 <option> 3302 VERANGANA JHALKARIBAI GOVT. GIRLS POLYTECHNIC, JHANSI</option>
 
 <option> 3303 GOVT. POLYTECHNIC, ETAWA</option>
 
  <option> 3304 GOVT. POLYTECHNIC, ORAI (JALAUN)</option>  
 
  <option> 3305 GOVT. POLYTECHNIC, BANDA</option>
 
  <option> 3306 GOVT. POLYTECHNIC, FARRUKHABAD</option>
 
  <option> 3307 GOVT. LEATHER INSTITUTE, KANPUR</option>
 
  <option> 3308 GOVT. POLYTECHNIC, GHATAMPUR, KANPUR</option>
 
 
 <option> 3309 GOVT. POLYTECHNIC, LALITPUR</option>
 
 <option> 3310 GOVT. POLYTECHNIC, MAHOBA</option>
 
   <option>3317 GOVT. GIRLS POLYTECHNIC, CHARKHARI MAHOBA</option>
 
 <option> 3318 GOVT. POLYTECHNIC, MADHOGARH JALAUN</option>
 
 <option>3319 GOVT. POLYTECHNIC, NARAINI, BANDA</option>

  <option>3320 GOVT. POLYTECHNIC, MANIKPUR, CHITRAKOOT</option>
 
  <option> 3321 GOVT. POLYTECHNIC, HAMIRPUR</option>
 
 
  <option>3331 BABA SAHEB BHEEMRAO AMBEDKAR GOVT POLYTECHNIC, AURAIYYA</option>
 
 <option>3332 MANYAWAR KANSHIRAM GOVT. POLYTECHNIC, KANNAUJ</option>
 
   <option>3338 GOVT. POLYTECHNIC, SIKANDARA, KANPUR DEHAT</option>
 
  <option> 3339 GOVT. POLYTECHNIC, BARGARH, CHITRAKOOT</option>
 
  <option> 3340 GOVT. POLYTECHNIC, TALBEHAT, LALITPUR</option>
 
  <option> 3341 GOVT. POLYTECHNIC,SARSAI,RATH, HAMIRPUR</option>
 
  <option>3351 MAHAMAYA POLYTECHNIC OF INFORMATION TECHNOLOGY KANPUR DEHAT</option>
 
  <option> 3352 MAHAMAYA POLYTECHNIC OF INFORMATION TECHNOLOGY AURAIYA</option>
 
  <option> 3353 MAHAMAYA POLYTECHNIC OF INFORMATION TECHNOLOGY KANNOUJ</option>
 
 <option> 4006 NORTHERN REGIONAL INST. OF PRINTING TECH. ALLAHABAD</option>
 
  <option> 4189
GOVT. POLYTECHNIC, ATRAULIYA, AZAMGARH ( RUN BY AICCEDS ) VILL-MAHRAHA TEHSIL-ATRAULIA BUDHANPUR AZAMGARH ( P P P
MODEL)</option>
  
  <option> 4401 GOVT. GIRLS POLYTECHNIC, VARANASI</option>
 
  <option>4402 GOVT. POLYTECHNIC, FATEHPUR</option>
 
 <option>4403 GOVT. POLYTECHNIC, BASTI</option>
 
   <option>4404 GOVT. POLYTECHNIC, GORAKHPUR</option>
 
 <option> 4405 GOVT. GIRLS. POLYTECHNIC, GORAKHPUR</option>
 
 
   <option>4407 GOVT. GIRLS POLYTECHNIC, ALLAHABAD</option>
 
  <option>4408 GOVT. GIRLS POLYTECHNIC, MEZA, ALLAHABAD</option>
 
 
  <option> 4409 GOVT. POLYTECHNIC, DEORIA</option>
 
  <option>4410 GOVT. POLYTECHNIC, GAZIPUR</option>
 
  <option>4411 SAVITRIBAI PHULE GOVT. POLYTECHNIC AZAMGARH</option>
 
   <option>4412 GOVT. POLYTECHNIC, JAUNPUR</option>
 
  <option> 4413 GOVT. POLYTECHNIC, MIRZAPUR</option>
 
  <option>4414 GOVT. POLYTECHNIC, PRATAPGARH</option>
 
   <option>4415 GOVT. GIRLS POLYTECHNIC, BALLIA</option>
 
  <option> 4422 MAHATAMA JYOTIBAPHULE GOVT. POLYTECHNIC, KAUSHAMBI</option>
 
 <option> 4425 GOVT. POLYTECHNIC, MAU</option>
 
  <option>4429 MAHAMAYA POLYTECHNIC OF INFORMATION TECHNOLOGY, HARIHARPUR, GORAKHPUR</option>
 
  <option>4430 MAHAMAYA POLYTECHNIC OF INFORMATION TECHNOLOGY CHANDAULI</option>

  
   <option>4444 GOVT. POLYTECHNIC, SONBHADRA</option>
 
   <option>4446 MAHAKARUNIK TATHAGAT GAUTAM BUDDHA GOVT. POLYTECHNIC, SIDDHARTHA NAGAR</option>
 
  <option> 4447 GOVT. POLYTECHNIC, AURAI, UGAPUR, BHADOHI ROAD, SANT RAVIDAS NAGAR</option>
 
 <option> 4448 GOVT. POLYTECHNIC, BHILIHILI, AZAMGARH</option>
 
   <option>4477 GOVT. POLYTECHNIC, PREMDHAR PATTI, RANIGANJ, PRATAPGARH</option>
 
  <option> 4478 GOVT. POLYTECHNIC, KURU PINDRA, VARANASI</option>
 
 
   <option>4479 GOVT. POLYTECHNIC, CHABILAHA, KHOR, SADAR , BASTI</option>
 
 
   <option>4480 GOVT. POLYTECHNIC, JIGIRSAND, SIKANDARPUR, BALLIA</option>
 
   <option>4806 MAHAMAYA POLYTECHNIC OF INFORMATION TECHNOLOGY KUSHINAGAR</option>
 
  <option>4807 MAHAMAYA POLYTECHNIC OF INFORMATION TECHNOLOGY MAHARAJGANJ</option>
 
 <option> 4808 GOVT. POLYTECHNIC SINDURIA SONBHADRA</option>
 
  <option> 4809 GOVT. POLYTECHNIC CHOPAN SONBHADRA</option>
 
   <option>4810 GOVT. POLYTECHNIC RAJGARH MIRZAPUR</option>
 
 
 <option> 4811 GOVT. POLYTECHNIC CHUNAR MIRZAPUR</option>
 
 <option> 4812 MAHAMAYA POLYTECHNIC OF INFORMATION TECHNOLOGY SANTKABIRNAGAR</option>
 
  <option> 4813 MAHAMAYA POLYTECHNIC OF INFORMATION TECHNOLOGY SIDHARTHANAGAR</option>
 
   <option>4814 MAHAMAYA POLYTECHNIC OF INFORMATION TECHNOLOGY KAUSAMBHI</option>
 
   <option>4815 GOVT. POLYTECHNIC BINDKI FATEHPUR</option>
 
 <option>4816 GOVT. POLYTECHNIC SANTKABIR NAGAR</option>
 
   <option>4817 GOVT. POLYTECHNIC CHARIYAON DEVRIA</option>
 
  <option>4833 SANT RAVIDAS GOVERNMENT POLYTECHNIC,CHAKIA,CHANDAULI</option>
  
  <option>4834 GOVT. POLYTECHNIC,MUJHANA ,HATA, KUSHINAGAR</option>
 
   <option>4835 GOVT. POLYTECHNIC,PURENA,SADAR,MAHARAJGANJ</option>
                </select>
              </div>

              {role === 'Teaching Staff' && (
                <>
                  <div className="col-md-6">
                    <select className="form-select" required>
                        <option> Select Branch </option>
                      <option> 	101 --- P.G.DIPLOMA IN ADVERTISING AND PUBLIC RELATION</option> 
 <option> 	102 --- P.G.DIPLOMA IN BIO TECHNOLOGY (TISSUE CULTURE)</option>
 <option>  	103 --- P.G.DIPLOMA IN TOURISM AND TRAVEL MANAGEMENT</option>
 <option> 	104 --- P.G.DIPLOMA IN TEXTILE DESIGN</option>
 <option> 105 --- INDUSTRIAL SAFETY</option>
 <option> 	106 --- P.G.DIPLOMA IN CUSTOMER SERVICE MANAGEMENT</option>
 <option> 107 --- P.G.DIPLOMA IN MARKETING AND SALES MANAGEMENT</option>
 <option> 109 --- P.G.DIPLOMA IN BEAUTY AND HEALTH CARE</option>
 <option> 	110 --- P.G.DIPLOMA IN FASHION TECHNOLOGY</option>
 <option> 	111 --- P G DIPLOMA IN RETAIL MANAGEMENT</option>
 <option> 	112 --- P G DIPLOMA IN ACCOUNTACY (WITH COMPUTERISED ACCOUNTS & TAXATION)</option>
 <option> 113 --- P G DIPLOMA IN WEB DESIGNING</option>
 <option> 	114 --- P G DIPLOMA IN COMPUTER HARDWARE & NETWORKING</option>
 <option> 	115 --- P.G.DIPLOMA IN CYBER SECURITY</option>
 <option> 	116 --- P.G.DIPLOMA IN DATA SCIENCE AND MACHINE LEARNING</option>
 <option> 	117 --- P.G.DIPLOMA IN DRONE TECHNOLOGY</option>
 <option> 	118 --- P.G.DIPLOMA IN IOT</option>
 <option> 	202 --- P.G.DIPLOMA IN COMPUTER APPLICATION</option>
 <option> 	211 --- HOME SCIENCE</option>
 <option> 	212 --- LIBRARY AND INFORMATION SCIENCE</option>
 <option> 	213 --- DIPLOMA IN MASS COMMUNICATION</option>
 <option> 	214 --- DIPLOMA IN PHARMACY</option>
 <option> 	215 --- MODERN OFFICE MANAGEMENT AND SECRETERIAL PRACTICE</option>
 <option> 	316 --- AGRICULTURE ENGINEERING</option>
 <option> 	317 --- DIPLOMA IN AIRCRAFT MAINTENANCE ENGINEERING</option>
 <option> 	318 --- ARCHITECTURAL ASSISTANTSHIP</option>
 <option> 	319 --- GLASS AND CERAMIC ENGINEERING</option>
 <option> 	320 --- CHEMICAL TECHNOLOGY (FERTILIZER)</option>
 <option> 	321 --- CHEMICAL TECHNOLOGY (RUBBER AND PLASTIC)</option>
 <option> 	322 --- CIVIL ENGINEERING</option>
 <option> 	323 --- CIVIL ENGINEERING (ENVIRONMENT & POLLUTION CONTROL)</option>
 <option> 	326 --- FASHION DESIGNING & GARMENT TECHNOLOGY</option>
 <option> 	327 --- DAIRY ENGINEERING</option>
 <option> 	328 --- ELECTRICAL ENGINEERING</option>
 <option> 329 --- ELECTRICAL ENGINEERING (INDUSTRIAL CONTROL)</option>
 <option> 	330 --- ELECTRONICS ENGINEERING</option>
 <option> 	331 --- ELECTRONICS ENGINEERING (MODERN CONSUMER ELECTRONICS)</option>
 <option> 	332 --- ELECTRONICS ENGINEERING (ADVANCE MICROPROCESSOR & INTERFACE)</option>
 <option> 	333 --- ELECTRONICS ENGINEERING (MICRO ELECTRONICS)</option>
 <option> 	334 --- ELECTRICAL AND ELECTRONICS ENGINEERING</option>
 <option> 	336 --- LEATHER TECHNOLOGY FOOTWEAR (COMPUTER AIDED SHOE DESIGN)</option>
 <option> 	337 --- DIPLOMA IN HOTEL MANAGEMENT AND CATERING TECHNOLOGY</option>
 <option> 338 --- INSTRUMENTATION AND CONTROL</option>
 <option> 339 --- INTERIOR DESIGN AND DECORATION</option>
 <option> 	340 --- LEATHER TECHNOLOGY (TANNING)</option>
 <option> 	341 --- MECHANICAL ENGINEERING (AUTOMOBILE)</option>
 <option> 	342 --- MECHANICAL ENGINEERING (COMPUTER AIDED DESIGN)</option>
 <option> 	343 --- MECHANICAL ENGINEERING (PRODUCTION)</option>
 <option> 	344 --- MECHANICAL ENGINEERING (REFRIGERATION & AIRCONDITIONING)</option>
 <option> 	345 --- MECHANICAL ENGINEERING (MAINTENANCE)</option>
 <option> 	348 --- TEXTILE CHEMISTRY</option>
 <option> 	349 --- TEXTILE DESIGN</option>
 <option> 	350 --- TEXTILE DESIGN (TEXTILE PRINTING)</option>
 <option> 	351 --- TEXTILE TECHNOLOGY</option>
 <option> 	352 --- CHEMICAL ENGINEERING</option>
 <option> 	353 --- CHEMICAL ENGINEERING (PETRO CHEMICAL) </option> 
 <option>   355 --- COMPUTER SCIENCE AND ENGINEERING</option>
 <option> 	356 --- INFORMATION TECHNOLOGY</option>
 <option> 	357 --- DIPLOMA IN PAINT TECHNOLOGY</option>
 <option> 	358 --- DIPLOMA IN PLASTIC MOULD TECHNOLOGY</option>
 <option> 	359 --- DIPLOMA IN AIRCRAFT MAINTENANCE ENGINEERING (AVIONICS)</option>
 <option> 	360 --- HELICOPTER AND POWER PLANT ENGINEERING</option>
 <option> 	361 --- ELECTRONICS & COMMUNICATION ENGINEERING</option>
 <option> 	362 --- CARPET TECHNOLOGY</option>
 <option> 	363 --- FOOD TECHNOLOGY</option>
 <option> 364 --- PAPER AND PULP TECHNOLOGY</option>
 <option> 365 --- TEXTILE ENGINEERING</option>
 <option> 	366 --- MINING ENGINEERING</option>
 <option> 	367 --- MECHANICAL ENGINEERING</option>
 <option> 368 --- CIVIL AND ENVIRONMENT ENGINEERING</option>
 <option> 	369 --- COMMUNICATION AND COMPUTER NETWORKING</option>
 <option> 	370 --- RENEWABLE ENERGY</option>
 <option> 	371 --- APPAREL DESIGN AND FASHION TECHNOLOGY</option>
 	<option> 372 --- COSTUME DESIGN AND GARMENT TECHNOLOGY</option>
 <option> 	373 --- CRAFT TECHNOLOGY</option>
<option> 	392 --- PRINTING TECHNOLOGY 444 --- TOOL AND MOULD MAKING</option>

                    </select>
                  </div>
                  <div className="col-md-6">
                     <input type="number" placeholder="Experience"/>
                  </div>
                  
                  {/* Designation Dropdown */}
<div className="col-12">
  <label className="form-label">Designation</label>
  <select className="form-select" required>
    <option value="">Select Designation</option>
    <option>Lecturer</option>
    <option>HOD</option>
    <option>Workshop Instructor</option>
    <option>Workshop Superintendent</option>
    <option>Librarian</option>
    <option>Computer Instructor</option>
  </select>
</div>

{/* Category of Employee with Subgroups */}
<div className="col-md-6">
  <label className="form-label">Category of Employee</label>
  <select
    className="form-select"
    value={selectedCategory}
    onChange={(e) => {
      setSelectedCategory(e.target.value);
      setSelectedSubCategory('');
    }}
    required
  >
    <option value="">Select Category</option>
    <option value="A">Group A</option>
    <option value="B">Group B</option>
    <option value="C">Group C</option>
  </select>
</div>

<div className="col-md-6">
  <label className="form-label">Subcategory</label>
  <select
    className="form-select"
    value={selectedSubCategory}
    onChange={(e) => setSelectedSubCategory(e.target.value)}
    required
  >
    <option value="">Select Subcategory</option>

    {selectedCategory === 'A' && (
      <>
        <option>Principal</option>
        <option>HOD</option>
      </>
    )}

    {selectedCategory === 'B' && (
      <>
        <option>Lecturer</option>
        <option>Librarian</option>
        <option>Workshop Superintendent</option>
      </>
    )}

    {selectedCategory === 'C' && (
      <>
        <option>Workshop Instructor</option>
        <option>Office Employee/Worker</option>
        <option>Computer Instructor</option>
        <option>Computer Operator</option>
        <option>Others</option>
      </>
    )}
  </select>
</div>

{/* Show text field if 'Others' is selected */}
{selectedSubCategory === 'Others' && (
  <div className="col-12">
    <label className="form-label">Specify Other Designation</label>
    <input type="text" className="form-control" placeholder="Please specify..." required />
  </div>
)}

                </>
              )}

              {role !== 'Teaching Staff' && (
                <div className="col-12">
                  <select className="form-select" required>
                    <option>Select Department/Unit</option>
                   
                  </select>
                </div>
              )}

              <div className="col-md-6">
                <input type="password" className="form-control" placeholder="Create Password" required />
              </div>
              <div className="col-md-6">
                <input type="password" className="form-control" placeholder="Confirm Password" required />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100">Create Account</button>
          </form>

          <p className="text-center text-muted mt-3">
            Already have an account?{' '}
            <button className="btn btn-link p-0" onClick={() => nav('/')}>
              Sign in here
            </button>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
