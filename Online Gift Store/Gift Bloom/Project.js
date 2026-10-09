const FALLBACK_IMG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='180'><rect width='200' height='180' fill='%23f1f5f9'/><text x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%2394a3b8' text-anchor='middle' dominant-baseline='middle'>No Image</text></svg>";

const INDIAN_STATES = {
    "Andhra Pradesh": ["Visakhapatnam", "Tirupati", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Anantapur", "Rajahmundry", "Kakinada", "Tadepalligudem", "Eluru", "Machilipatnam", "Ongole", "Nandyal", "Kadapa", "Hindupur", "Tiruvuru", "Tadikonda", "Mangalagiri", "Dharmavaram", "Penukonda", "Puttur", "Srikalahasti", "Narasaraopet", "Macherla", "Sattenapalli", "Bapatla", "Chirala", "Tenali", "Narasapuram", "Bhimavaram", "Tanuku", "Tirupati", "Madanapalle", "Jammalamadugu", "Proddatur", "Mydukur", "Pullampeta", "Rajampet", "Rayachoti", "Pileru", "Chittoor", "Palamaner", "Kuppam", "Gudur", "Sullurpeta", "Venkatagiri", "Gudivada", "Machilipatnam", "Amaravati", "Guntur", "Tenali", "Bapatla", "Narasaraopet", "Macherla", "Sattenapalli", "Mangalagiri", "Tadepalligudem", "Eluru", "Tiruvuru", "Dharmavaram", "Sri Sathya Sai", "Anantapur", "Kurnool", "Nandyal", "Gadivemula", "Nandikotkur", "Alur", "Guntakal", "Gooty", "Peddapalli", "Ramagundam", "Mancherial", "Bellampalli", "Chennur", "Asifabad", "Komaram Bheem", "Manuguru", "Bayyaram", "Garla", "Jessore", "Dornakal", "Gudur", "Sullurpeta", "Venkatagiri", "Tirupati", "Srikalahasti", "Sathya Sai", "Puttur", "Sri Kalahasti", "Chittoor", "Palamaner", "Kuppam", "Punganur", "Ramakuppam", "Bukkapuram", "Chowdepalli", "Chagalamarri", "Kalluru", "Kodur", "Rayachoti", "Rajampet", "Pullampeta", "Mydukur", "Proddatur", "Jammalamadugu", "Madanapalle", "Tirupati", "Tiruvuru", "Gudivada", "Machilipatnam", "Amaravati", "Guntur", "Tenali", "Bapatla", "Narasaraopet", "Macherla", "Sattenapalli", "Mangalagiri", "Tadepalligudem", "Eluru", "Nellore", "Gudur", "Sullurpeta", "Venkatagiri", "Sri Potti Sriramulu Nellore", "Kavali", "Atmakur", "Venkatagiri", "Gudivada", "Machilipatnam", "Amaravati", "Guntur", "Tenali", "Bapatla", "Narasaraopet", "Macherla", "Sattenapalli", "Mangalagiri", "Tadepalligudem", "Eluru", "Tiruvuru", "Dharmavaram", "Sri Sathya Sai", "Anantapur", "Kurnool", "Nandyal", "Gadivemula", "Nandikotkur", "Alur", "Guntakal", "Gooty"],
    "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Tawang", "Ziro", "Pasighat", "Tezu", "Koloriang", "Namsai", "Changlang", "Khonsa", "Naharlagun", "Yupia", "Naharlagun", "Ziro", "Tawang", "Tezu", "Pasighat", "Koloriang", "Namsai", "Changlang", "Khonsa", "Itanagar", "Yupia", "Naharlagun", "Ziro", "Tawang", "Tezu", "Pasighat", "Koloriang", "Namsai", "Changlang", "Khonsa"],
    "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Barpeta", "Goalpara", "Kokrajhar", "Tezpur", "Nalbari", "Dhubri", "Lakhimpur", "Sivasagar", "Charaideo", "Hojai", "Morigaon", "Kamrup", "Biswanath", "Sonitpur", "Udalguri", "Baksa", "Chirang", "Kokrajhar", "Bongaigaon", "North Lakhimpur", "South Salmara", "Hailakandi", "Karbi Anglong", "West Karbi Anglong", "Dima Hasao", "Cachar", "Hojai", "Nagaon", "Sivasagar", "Jorhat", "Golaghat", "Karbi Anglong", "West Karbi Anglong", "Dima Hasao", "Cachar", "Hailakandi", "Karbi Anglong", "West Karbi Anglong", "Dima Hasao", "Cachar", "Hojai", "Nagaon", "Sivasagar", "Jorhat", "Golaghat", "Karbi Anglong", "West Karbi Anglong", "Dima Hasao", "Cachar", "Hailakandi"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Arrah", "Begusarai", "Katihar", "Purnia", "Bhilai", "Bokaro", "Dhanbad", "Hazaribagh", "Jamui", "Khagaria", "Kishanganj", "Lakhisarai", "Madhubani", "Monghyr", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Samastipur", "Saran", "Sheikhpura", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran", "East Champaran", "Begusarai", "Bhojpur", "Buxar", "Darbhanga", "Gaya", "Jamui", "Khagaria", "Kishanganj", "Lakhisarai", "Madhubani", "Monghyr", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Samastipur", "Saran", "Sheikhpura", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
    "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Rajnandgaon", "Durg", "Jagdalpur", "Raigarh", "Ambikapur", "Mahasamund", "Janjgir", "Champa", "Dhamtari", "Kanker", "Narayanpur", "Bijapur", "Sukma", "Bastar", "Kondagaon", "Narayanpur", "Bijapur", "Sukma", "Bastar", "Kondagaon", "Raipur", "Bhilai", "Bilaspur", "Korba", "Rajnandgaon", "Durg", "Jagdalpur", "Raigarh", "Ambikapur", "Mahasamund", "Janjgir", "Champa", "Dhamtari", "Kanker"],
    "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Mormugao", "Bicholim", "Sanquelim", "Valpoi", "Sanguem", "Quepem", "Canacona", "Dharbandora", "Sattari", "Tiswadi", "Ilhas", "Bardez", "Salcette"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Bhavnagar", "Jamnagar", "Anand", "Banas Kantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dhandhuka", "Gandhinagar", "Godhra", "Jamnagar", "Junagadh", "Kachchh", "Kheda", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Tapi", "Vadodara", "Valsad", "Anand", "Banas Kantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dhandhuka", "Gandhinagar", "Godhra", "Jamnagar", "Junagadh", "Kachchh", "Kheda", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Tapi", "Vadodara", "Valsad"],
    "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal", "Sonipat", "Hisar", "Rohtak", "Bhiwani", "Mahendragarh", "Rewari", "Jhajjar", "Palwal", "Kurukshetra", "Panchkula", "Yamunanagar", "Kaithal", "Pehowa", "Thanesar", "Panipat", "Ambala", "Karnal", "Sonipat", "Hisar", "Rohtak", "Bhiwani", "Mahendragarh", "Rewari", "Jhajjar", "Palwal", "Kurukshetra", "Panchkula", "Yamunanagar", "Kaithal", "Pehowa", "Thanesar"],
    "Himachal Pradesh": ["Shimla", "Mandi", "Solan", "Kullu", "Dharamsala", "Bilaspur", "Hamirpur", "Kangra", "Una", "Chamba", "Kinnaur", "Lahaul and Spiti", "Sirmaur", "Solan", "Mandi", "Kullu", "Dharamsala", "Bilaspur", "Hamirpur", "Kangra", "Una", "Chamba", "Kinnaur", "Lahaul and Spiti", "Sirmaur", "Shimla", "Mandi", "Solan", "Kullu", "Dharamsala", "Bilaspur", "Hamirpur", "Kangra", "Una", "Chamba", "Kinnaur", "Lahaul and Spiti", "Sirmaur"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar", "Giridih", "Lohardaga", "Sahebganj", "Dumka", "Godda", "Jamtara", "Garhwa", "Latehar", "Simdega", "Khunti", "Ramgarh", "Hazaribagh", "Deoghar", "Giridih", "Lohardaga", "Sahebganj", "Dumka", "Godda", "Jamtara", "Garhwa", "Latehar", "Simdega", "Khunti", "Ramgarh", "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"],
    "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davangere", "Shimoga", "Tumkur", "Raichur", "Bijapur", "Chitradurga", "Bellary", "Tirupati", "Dharwad", "Udupi", "Chamarajanagar", "Mandya", "Hassan", "Kodagu", "Chikmagalur", "Shimoga", "Tumkur", "Raichur", "Bijapur", "Chitradurga", "Bellary", "Dharwad", "Udupi", "Chamarajanagar", "Mandya", "Hassan", "Kodagu", "Chikmagalur", "Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davangere"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Alappuzha", "Palakkad", "Malappuram", "Kannur", "Kasaragod", "Wayanad", "Idukki", "Ernakulam", "Thrissur", "Kollam", "Alappuzha", "Palakkad", "Malappuram", "Kannur", "Kasaragod", "Wayanad", "Idukki", "Thiruvananthapuram", "Kochi", "Kozhikode"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Rewa", "Bilaspur", "Chhindwara", "Hoshangabad", "Vidisha", "Sehore", "Shajapur", "Ratlam", "Mandsaur", "Neemuch", "Morena", "Sheopur", "Datia", "Tikamgarh", "Chhatarpur", "Panna", "Damoh", "Katni", "Narsinghpur", "Raisen", "Vidisha", "Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Rewa", "Bilaspur", "Chhindwara", "Hoshangabad", "Vidisha", "Sehore", "Shajapur", "Ratlam", "Mandsaur", "Neemuch", "Morena", "Sheopur", "Datia", "Tikamgarh", "Chhatarpur", "Panna", "Damoh", "Katni", "Narsinghpur", "Raisen"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Navi Mumbai", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur", "Sangli", "Satara", "Ratnagiri", "Sindhudurg", "Latur", "Osmanabad", "Beed", "Nanded", "Hingoli", "Wardha", "Yavatmal", "Chandrapur", "Gadchiroli", "Bhandara", "Gondia", "Akola", "Washim", "Buldhana", "Dhule", "Jalgaon", "Ahmednagar", "Pune", "Mumbai", "Navi Mumbai", "Thane", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur", "Sangli", "Satara", "Ratnagiri", "Sindhudurg", "Latur", "Osmanabad", "Beed", "Nanded", "Hingoli", "Wardha", "Yavatmal", "Chandrapur", "Gadchiroli", "Bhandara", "Gondia", "Akola", "Washim", "Buldhana", "Dhule", "Jalgaon", "Ahmednagar"],
    "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Tamenglong", "Chandel", "Ukhrul", "Senapati", "Tamenglong", "Chandel", "Ukhrul", "Senapati", "Imphal", "Thoubal", "Bishnupur", "Churachandpur"],
    "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongstoin", "Williamnagar", "Mawsynram", "Cherrapunji", "Shillong", "Tura", "Jowai", "Nongstoin", "Williamnagar", "Mawsynram", "Cherrapunji"],
    "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib", "Mamit", "Saiha", "Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib", "Mamit", "Saiha"],
    "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Zunheboto", "Wokha", "Mon", "Phek", "Kohima", "Dimapur", "Mokokchung", "Tuensang", "Zunheboto", "Wokha", "Mon", "Phek"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", "Baripada", "Jeypore", "Koraput", "Angul", "Dhenkanal", "Keonjhar", "Mayurbhanj", "Nayagarh", "Ganjam", "Kandhamal", "Boudh", "Sonepur", "Balangir", "Nuapada", "Kalahandi", "Rayagada", "Koraput", "Jeypore", "Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", "Baripada"],
    "Punjab": ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Hoshiarpur", "Pathankot", "Mansa", "Barnala", "Sangrur", "Fazilka", "Firozpur", "Muktsar", "Rupnagar", "SAS Nagar", "Fatehgarh Sahib", "Faridkot", "Sri Muktsar Sahib", "Barnala", "Sangrur", "Fazilka", "Firozpur", "Muktsar", "Rupnagar", "SAS Nagar", "Fatehgarh Sahib", "Faridkot", "Sri Muktsar Sahib", "Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Hoshiarpur", "Pathankot", "Mansa"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Bhilwara", "Alwar", "Sikar", "Bharatpur", "Dausa", "Tonk", "Churu", "Sri Ganganagar", "Hanumangarh", "Barmer", "Jaisalmer", "Sirohi", "Pali", "Nagaur", "Chittorgarh", "Banswara", "Dungarpur", "Pratapgarh", "Baran", "Jhalawar", "Kota", "Ajmer", "Bikaner", "Bhilwara", "Alwar", "Sikar", "Bharatpur", "Dausa", "Tonk", "Churu", "Sri Ganganagar", "Hanumangarh", "Barmer", "Jaisalmer", "Sirohi", "Pali", "Nagaur", "Chittorgarh", "Banswara", "Dungarpur", "Pratapgarh", "Baran", "Jhalawar", "Jaipur", "Jodhpur", "Udaipur"],
    "Sikkim": ["Gangtok", "Namchi", "Geyzing", "Mangan", "Singtam", "Rangpo", "Jorethang", "Pelling", "Gangtok", "Namchi", "Geyzing", "Mangan", "Singtam", "Rangpo", "Jorethang", "Pelling"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Thanjavur", "Dindigul", "Karur", "Nagapattinam", "Perambalur", "Pudukkottai", "Ramanathapuram", "Sivaganga", "Thanjavur", "Tiruvannamalai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Coimbatore", "Madurai", "Chennai", "Kanchipuram", "Tiruvallur", "Ranipet", "Vellore", "Tiruvannamalai", "Krishnagiri", "Dharmapuri", "Namakkal", "Erode", "Tiruppur", "Dindigul", "Karur", "Nagapattinam", "Perambalur", "Pudukkottai", "Ramanathapuram", "Sivaganga", "Thanjavur", "Salem", "Tirunelveli"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Mahbubnagar", "Nalgonda", "Adilabad", "Komaram Bheem", "Mancherial", "Peddapalli", "Rajanna Sircilla", "Siddipet", "Suryapet", "Vikarabad", "Yadadri Bhuvanagiri", "Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Mahbubnagar", "Nalgonda", "Adilabad", "Komaram Bheem", "Mancherial", "Peddapalli", "Rajanna Sircilla", "Siddipet", "Suryapet", "Vikarabad", "Yadadri Bhuvanagiri"],
    "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailasahar", "Belonia", "Sabroom", "Amarpur", "Gomati", "Sipahijala", "Unakoti", "Agartala", "Udaipur", "Dharmanagar", "Kailasahar", "Belonia", "Sabroom", "Amarpur", "Gomati", "Sipahijala", "Unakoti"],
    "Uttar Pradesh": ["Lucknow", "Agra", "Varanasi", "Kanpur", "Allahabad", "Meerut", "Ghaziabad", "Noida", "Faridabad", "Gorakhpur", "Saharanpur", "Bareilly", "Aligarh", "Moradabad", "Ghaziabad", "Noida", "Faridabad", "Agra", "Varanasi", "Kanpur", "Allahabad", "Meerut", "Lucknow", "Gorakhpur", "Saharanpur", "Bareilly", "Aligarh", "Moradabad", "Bulandshahr", "Hapur", "Gautam Buddha Nagar", "Ghaziabad", "Noida", "Faridabad", "Agra", "Varanasi", "Kanpur", "Prayagraj", "Meerut", "Lucknow", "Gorakhpur", "Saharanpur", "Bareilly", "Aligarh", "Moradabad", "Bulandshahr", "Hapur", "Gautam Buddha Nagar"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Rishikesh", "Haldwani", "Roorkee", "Kashipur", "Ramnagar", "Rudrapur", "Kotdwar", "Srinagar", "Pauri", "Tehri", "Chamoli", "Udham Singh Nagar", "Haridwar", "Dehradun", "Rishikesh", "Haldwani", "Roorkee", "Kashipur", "Ramnagar", "Rudrapur", "Kotdwar", "Srinagar", "Pauri", "Tehri", "Chamoli", "Udham Singh Nagar"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "South 24 Parganas", "East Midnapore", "West Midnapore", "Purulia", "Bankura", "Birbhum", "Paschim Medinipur", "Purba Medinipur", "Cooch Behar", "Jalpaiguri", "Alipurduar", "Kalimpong", "Darjeeling", "Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "South 24 Parganas", "East Midnapore", "West Midnapore", "Purulia", "Bankura", "Birbhum", "Paschim Medinipur", "Purba Medinipur", "Cooch Behar", "Jalpaiguri", "Alipurduar", "Kalimpong", "Darjeeling"]
};

function populateStateDropdowns() {
    const stateSelects = document.querySelectorAll("select[id$='-state']");
    stateSelects.forEach(sel => {
        if (sel.options.length > 1) return;
        Object.keys(INDIAN_STATES).sort().forEach(state => {
            const opt = document.createElement("option");
            opt.value = state;
            opt.textContent = state;
            sel.appendChild(opt);
        });
    });
}

function populateCitiesForProfile() {
    const state = document.getElementById("profile-state").value;
    const citySel = document.getElementById("profile-city");
    if (!citySel) return;
    citySel.innerHTML = '<option value="">Select City</option>';
    if (state && INDIAN_STATES[state]) {
        const unique = [...new Set(INDIAN_STATES[state])];
        unique.sort().forEach(city => {
            const opt = document.createElement("option");
            opt.value = city;
            opt.textContent = city;
            citySel.appendChild(opt);
        });
    }
}

function populateCitiesForCheckout() {
    const state = document.getElementById("checkout-state").value;
    const citySel = document.getElementById("checkout-city");
    if (!citySel) return;
    citySel.innerHTML = '<option value="">Select City</option>';
    if (state && INDIAN_STATES[state]) {
        const unique = [...new Set(INDIAN_STATES[state])];
        unique.sort().forEach(city => {
            const opt = document.createElement("option");
            opt.value = city;
            opt.textContent = city;
            citySel.appendChild(opt);
        });
    }
}

let cart = [];
let currentUser = null;

function getUsers() {
    const raw = localStorage.getItem("giftStoreUsers");
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem("giftStoreUsers", JSON.stringify(users));
}

function saveCart(cartData) {
    localStorage.setItem("cart", JSON.stringify(cartData));
}

function getTheme() {
    return localStorage.getItem("theme") || "light";
}

function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    const btn = document.getElementById("theme-btn");
    if (btn) {
        const sunIcon = btn.querySelector(".theme-icon-sun");
        const moonIcon = btn.querySelector(".theme-icon-moon");
        if (sunIcon && moonIcon) {
            if (theme === "dark") {
                sunIcon.style.display = "flex";
                moonIcon.style.display = "none";
            } else {
                sunIcon.style.display = "none";
                moonIcon.style.display = "flex";
            }
        }
    }
}

function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "light" : "dark");
}

setTheme(getTheme());

function renderProfile() {
    const profileEl = document.getElementById("profile-bar");
    if (profileEl) {
        profileEl.classList.remove("hidden");
        profileEl.classList.remove("open");
    }
    updateHeaderProfilePicture();
}

function updateHeaderProfilePicture() {
    const email = localStorage.getItem("giftStoreCurrentEmail") || (currentUser && currentUser.email) || "";
    const profile = email ? loadSavedProfile(email) : (currentUser || {});
    const imgEl = document.getElementById("header-profile-picture");
    const iconEl = document.getElementById("header-profile-icon");
    if (profile.profilePicture) {
        if (imgEl) {
            imgEl.src = profile.profilePicture;
            imgEl.style.display = "inline-block";
        }
        if (iconEl) {
            iconEl.style.display = "none";
        }
    } else {
        if (imgEl) {
            imgEl.src = "";
            imgEl.style.display = "none";
        }
        if (iconEl) {
            iconEl.style.display = "inline-flex";
        }
    }
}

function isLoggedIn() {
    return localStorage.getItem("giftStoreUser") === "true";
}

function setLoggedIn(status) {
    if (status) localStorage.setItem("giftStoreUser", "true");
    else localStorage.removeItem("giftStoreUser");
}

function getCurrentUser() {
    return currentUser;
}

function setCurrentUser(user) {
    currentUser = user;
}

function getProfileKey(email) {
    return "giftStoreProfile_" + email.replace(/[^a-zA-Z0-9]/g, "_");
}

function loadSavedProfile(email) {
    const raw = localStorage.getItem(getProfileKey(email));
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
}

function saveProfileToStorage(email, data) {
    localStorage.setItem(getProfileKey(email), JSON.stringify(data));
}

function toggleProfileMenu() {
    const dropdown = document.getElementById("profile-dropdown");
    if (dropdown) {
        dropdown.classList.toggle("open");
        updateProfileMenu();
    }
}

function closeProfileMenu() {
    const dropdown = document.getElementById("profile-dropdown");
    if (dropdown) {
        dropdown.classList.remove("open");
    }
}

function updateProfileMenu() {
    const guestMenu = document.getElementById("profile-menu-guest");
    const userMenu = document.getElementById("profile-menu-user");
    const profileBar = document.getElementById("profile-bar");
    const user = currentUser;

    if (user && user.name) {
        if (guestMenu) guestMenu.classList.add("hidden");
        if (userMenu) userMenu.classList.remove("hidden");
        if (profileBar) profileBar.classList.remove("hidden");
        document.getElementById("dropdown-user-name").textContent = user.name || "User";
        document.getElementById("dropdown-user-email").textContent = user.email || "";
    } else {
        if (guestMenu) guestMenu.classList.remove("hidden");
        if (userMenu) userMenu.classList.add("hidden");
        if (profileBar) profileBar.classList.remove("hidden");
    }
}

function openAuthModal(type) {
    closeProfileMenu();
    document.getElementById("auth-modal-login").classList.add("hidden");
    document.getElementById("auth-modal-signup").classList.add("hidden");
    document.getElementById("auth-modal-" + type).classList.remove("hidden");
    document.getElementById("auth-modal").classList.remove("hidden");
    document.getElementById(type === "login" ? "login-email" : "signup-email").focus();
}

function closeAuthModal() {
    document.getElementById("auth-modal").classList.add("hidden");
    document.getElementById("login-error").classList.remove("visible");
    document.getElementById("signup-error").classList.remove("visible");
}

function switchAuthModal(type) {
    document.getElementById("auth-modal-login").classList.add("hidden");
    document.getElementById("auth-modal-signup").classList.add("hidden");
    document.getElementById("auth-modal-" + type).classList.remove("hidden");
    document.getElementById(type === "login" ? "login-error" : "signup-error").classList.remove("visible");
    document.getElementById(type === "login" ? "login-email" : "signup-name").focus();
}

function showApp() {
    updateProfileMenu();
    renderProfile();
    showPage("home");
}

function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const eyeOpen = btn.querySelector('.eye-open');
    const eyeClosed = btn.querySelector('.eye-closed');
    if (input.type === 'password') {
        input.type = 'text';
        eyeOpen.classList.add('hidden');
        eyeClosed.classList.remove('hidden');
    } else {
        input.type = 'password';
        eyeOpen.classList.remove('hidden');
        eyeClosed.classList.add('hidden');
    }
}

function handleLogin() {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();
    const errorEl = document.getElementById("login-error");

    if (!email || !password) {
        errorEl.innerText = "Please fill in all fields.";
        errorEl.classList.add("visible");
        return;
    }

    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (user) {
        currentUser = loadSavedProfile(user.email) || { name: user.name, email: user.email };
        localStorage.setItem("giftStoreUser", "true");
        localStorage.setItem("giftStoreCurrentEmail", user.email);
        document.getElementById("login-email").value = "";
        document.getElementById("login-password").value = "";
        errorEl.classList.remove("visible");
        closeAuthModal();
        updateProfileMenu();
        renderProfile();
        showToast("Welcome back, " + (currentUser.name || "User") + "!");
    } else {
        errorEl.innerText = "Invalid email or password.";
        errorEl.classList.add("visible");
    }
}

function handleSignup() {
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const errorEl = document.getElementById("signup-error");

    if (!name || !email || !password) {
        errorEl.innerText = "Please fill in all fields.";
        errorEl.classList.add("visible");
        return;
    }

    if (password.length < 6) {
        errorEl.innerText = "Password must be at least 6 characters.";
        errorEl.classList.add("visible");
        return;
    }

    const users = getUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        errorEl.innerText = "An account with this email already exists.";
        errorEl.classList.add("visible");
        return;
    }

    users.push({ name, email, password });
    saveUsers(users);

    currentUser = { name, email };
    saveProfileToStorage(email, currentUser);
    localStorage.setItem("giftStoreUser", "true");
    localStorage.setItem("giftStoreCurrentEmail", email);
    document.getElementById("signup-name").value = "";
    document.getElementById("signup-email").value = "";
    document.getElementById("signup-password").value = "";
    errorEl.classList.remove("visible");
    closeAuthModal();
    updateProfileMenu();
    renderProfile();
    showToast("Account created successfully! Welcome, " + name + "!");
}

function logout() {
    currentUser = null;
    localStorage.removeItem("giftStoreUser");
    localStorage.removeItem("giftStoreCurrentEmail");
    updateProfileMenu();
    renderProfile();
    showPage("home");
    showToast("Logged out successfully.");
}

function deleteAccount() {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
    const email = localStorage.getItem("giftStoreCurrentEmail") || (currentUser && currentUser.email) || "";
    if (email) {
        localStorage.removeItem(getProfileKey(email));
    }
    localStorage.removeItem("giftStoreUser");
    localStorage.removeItem("giftStoreCurrentEmail");
    const users = getUsers().filter(u => u.email !== email);
    saveUsers(users);
    const orders = getOrders().filter(o => o.name !== (currentUser && currentUser.name));
    localStorage.setItem("giftStoreOrders", JSON.stringify(orders));
    currentUser = null;
    cart = [];
    saveCart(cart);
    updateCartCount();
    updateProfileMenu();
    renderProfile();
    showPage("home");
    showToast("Account deleted successfully.");
}

function showProfilePage() {
    const homePage = document.getElementById("home-page");
    if (homePage) homePage.classList.add("hidden");
    const cartPage = document.getElementById("cart-page");
    if (cartPage) cartPage.classList.add("hidden");
    const productDetail = document.getElementById("product-detail");
    if (productDetail) productDetail.classList.add("hidden");
    const hero = document.getElementById("hero-section");
    if (hero) hero.classList.add("hidden");
    const checkoutPage = document.getElementById("checkout-page");
    if (checkoutPage) checkoutPage.classList.add("hidden");
    const profilePage = document.getElementById("profile-page");
    if (profilePage) profilePage.classList.remove("hidden");
    loadProfilePage();
    renderOrders();
    updateHeaderProfilePicture();
    window.scrollTo(0, 0);
}

function loadProfilePage() {
    const email = localStorage.getItem("giftStoreCurrentEmail") || (currentUser && currentUser.email) || "";
    const profile = (email && loadSavedProfile(email)) || currentUser || {};
    currentUser = profile;
    document.getElementById("profile-name").value = profile.name || "";
    document.getElementById("profile-email").value = profile.email || email || "";
    document.getElementById("profile-phone").value = profile.phone || "";
    document.getElementById("profile-dob").value = profile.dob || "";
    document.getElementById("profile-gender").value = profile.gender || "";
    document.getElementById("profile-address").value = profile.address || "";
    document.getElementById("profile-location").value = profile.location || "";
    document.getElementById("profile-state").value = profile.state || "";
    populateCitiesForProfile();
    document.getElementById("profile-city").value = profile.city || "";
    document.getElementById("profile-pincode").value = profile.pincode || "";
    document.getElementById("profile-sidebar-name").textContent = profile.name || "User";
    document.getElementById("profile-sidebar-email").textContent = profile.email || email || "";
    document.getElementById("profile-error").classList.remove("visible");

    const imgEl = document.getElementById("profile-picture-img");
    const placeholderEl = document.getElementById("profile-picture-placeholder");
    if (profile.profilePicture) {
        if (imgEl) {
            imgEl.src = profile.profilePicture;
            imgEl.style.display = "block";
        }
        if (placeholderEl) {
            placeholderEl.style.display = "none";
        }
    } else {
        if (imgEl) {
            imgEl.src = "";
            imgEl.style.display = "none";
        }
        if (placeholderEl) {
            placeholderEl.style.display = "block";
        }
    }
}

function saveProfile() {
    const name = document.getElementById("profile-name").value.trim();
    const email = document.getElementById("profile-email").value.trim();
    const phone = document.getElementById("profile-phone").value.trim();
    const dob = document.getElementById("profile-dob").value;
    const gender = document.getElementById("profile-gender").value;
    const address = document.getElementById("profile-address").value.trim();
    const location = document.getElementById("profile-location").value.trim();
    const city = document.getElementById("profile-city").value.trim();
    const state = document.getElementById("profile-state").value.trim();
    const pincode = document.getElementById("profile-pincode").value.trim();
    const errorEl = document.getElementById("profile-error");

    if (!name || !email) {
        errorEl.innerText = "Name and email are required.";
        errorEl.classList.add("visible");
        return;
    }

    if (phone && !/^\d{10}$/.test(phone)) {
        errorEl.innerText = "Please enter a valid 10-digit phone number.";
        errorEl.classList.add("visible");
        return;
    }

    if (pincode && !/^\d{6}$/.test(pincode)) {
        errorEl.innerText = "Please enter a valid 6-digit pin code.";
        errorEl.classList.add("visible");
        return;
    }

    const existingProfile = loadSavedProfile(email) || currentUser || {};
    const profile = { name, email, phone, dob, gender, address, location, city, state, pincode, profilePicture: existingProfile.profilePicture || null };
    saveProfileToStorage(email, profile);
    currentUser = profile;
    localStorage.setItem("giftStoreCurrentEmail", email);
    document.getElementById("profile-sidebar-name").textContent = name;
    document.getElementById("profile-sidebar-email").textContent = email;
    renderProfile();
    showToast("Profile updated successfully!");
}

function handleProfilePicture(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        setProfilePictureDataUrl(e.target.result);
    };
    reader.readAsDataURL(file);
    input.value = "";
}

function setProfilePictureDataUrl(dataUrl) {
    const imgEl = document.getElementById("profile-picture-img");
    const placeholderEl = document.getElementById("profile-picture-placeholder");
    if (imgEl) {
        imgEl.src = dataUrl;
        imgEl.style.display = "block";
    }
    if (placeholderEl) {
        placeholderEl.style.display = "none";
    }
    const email = localStorage.getItem("giftStoreCurrentEmail") || (currentUser && currentUser.email) || "";
    if (email) {
        const profile = loadSavedProfile(email) || {};
        profile.profilePicture = dataUrl;
        saveProfileToStorage(email, profile);
        currentUser = profile;
    }
    showToast("Profile picture updated!");
    updateHeaderProfilePicture();
}

function removeProfilePicture() {
    const imgEl = document.getElementById("profile-picture-img");
    const placeholderEl = document.getElementById("profile-picture-placeholder");
    if (imgEl) {
        imgEl.src = "";
        imgEl.style.display = "none";
    }
    if (placeholderEl) {
        placeholderEl.style.display = "block";
    }
    const email = localStorage.getItem("giftStoreCurrentEmail") || (currentUser && currentUser.email) || "";
    if (email) {
        const profile = loadSavedProfile(email) || {};
        profile.profilePicture = null;
        saveProfileToStorage(email, profile);
        currentUser = profile;
    }
    showToast("Profile picture removed!");
    updateHeaderProfilePicture();
}

let cameraStream = null;

function openCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showToast("Camera Not Found, Please Insert Camera");
        return;
    }

    navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
        }
    }).then(function (stream) {
        cameraStream = stream;
        const video = document.getElementById("camera-video");
        if (video) {
            video.srcObject = stream;
        }
        const modal = document.getElementById("camera-modal");
        if (modal) {
            modal.classList.remove("hidden");
        }
    }).catch(function (err) {
        console.error("Camera error:", err);
        showToast("Camera Not Found, Please Insert Camera");
    });
}

function capturePhoto() {
    const video = document.getElementById("camera-video");
    const canvas = document.getElementById("camera-canvas");
    if (!video || !canvas) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setProfilePictureDataUrl(dataUrl);
    closeCamera();
}

function closeCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(function (track) {
            track.stop();
        });
        cameraStream = null;
    }
    const video = document.getElementById("camera-video");
    if (video) {
        video.srcObject = null;
    }
    const modal = document.getElementById("camera-modal");
    if (modal) {
        modal.classList.add("hidden");
    }
}

function toggleProfileDropdown() {
    const dropdown = document.getElementById("profile-dropdown");
    if (dropdown) {
        dropdown.classList.toggle("open");
    }
}

function toggleMobileMenu() {
    const nav = document.getElementById("header-nav");
    const overlay = document.getElementById("nav-overlay");
    const toggle = document.querySelector(".header-mobile-toggle");
    if (nav) nav.classList.toggle("open");
    if (overlay) overlay.classList.toggle("active");
    if (toggle) toggle.classList.toggle("open");
}

function showPage(page) {
    updateHeaderProfilePicture();
    const nav = document.getElementById("header-nav");
    const overlay = document.getElementById("nav-overlay");
    const toggle = document.querySelector(".header-mobile-toggle");
    if (nav) nav.classList.remove("open");
    if (overlay) overlay.classList.remove("active");
    if (toggle) toggle.classList.remove("open");
    const pages = ["home-page", "cart-page", "product-detail", "hero-section", "checkout-page", "profile-page", "orders-page", "ten-minute-page", "ten-minute-home"];
    pages.forEach(p => {
        const el = document.getElementById(p);
        if (el) el.classList.add("hidden");
    });
    const target = document.getElementById(page + "-page");
    if (target) target.classList.remove("hidden");
    if (page === "home") {
        const hero = document.getElementById("hero-section");
        if (hero) hero.classList.remove("hidden");
        filterCat("All");
    }
    if (page === "ten-minute") {
        const tenHero = document.getElementById("ten-minute-hero");
        const tenHome = document.getElementById("ten-minute-home");
        if (tenHero) tenHero.classList.remove("hidden");
        if (tenHome) tenHome.classList.remove("hidden");
        if (typeof renderDeliveryProducts === "function") renderDeliveryProducts();
    }
    if (page === "cart") {
        if (!requireLogin()) return;
        displayCart();
    }
    if (page === "checkout") {
        if (!requireLogin()) return;
        renderCheckoutSummary();
        populateStateDropdowns();
        autoFillCheckoutDetails();
        loadPaymentDetails();
        togglePaymentSections();
    }
    if (page === "orders") {
        if (!requireLogin()) return;
        showOrdersPage();
    }
    applyActiveNav(page);
    window.scrollTo(0, 0);
}

function applyActiveNav(page) {
    document.querySelectorAll(".header-nav-item").forEach(item => {
        item.classList.remove("active");
    });
    const nav = document.getElementById("header-nav");
    if (!nav) return;
    const buttons = nav.querySelectorAll(".header-nav-item");
    const pageMap = { home: 0, orders: 1, cart: 2 };
    const idx = pageMap[page];
    if (idx !== undefined && buttons[idx]) {
        buttons[idx].classList.add("active");
    }
}

function applyFilter(cat) {
    if (!requireLogin()) return;
    filterCat(cat);
}

function filterCat(cat) {
    let cards = document.querySelectorAll("#product-list .card");
    let visibleCount = 0;
    cards.forEach(card => {
        if (cat === "All" || card.dataset.category === cat) {
            card.style.display = "";
            card.style.animation = 'none';
            card.offsetHeight;
            card.style.animation = null;
            visibleCount++;
        } else {
            card.style.display = "none";
        }
    });
    document.getElementById("item-count").innerText = `Showing ${visibleCount} Gifts`;
    document.getElementById("search-input").value = "";

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.remove("active");
        if (btn.getAttribute("onclick").includes(`'${cat}'`)) {
            btn.classList.add("active");
        }
    });
}

function searchProducts(query) {
    const term = query.toLowerCase().trim();
    let cards = document.querySelectorAll("#product-list .card");
    let visibleCount = 0;
    cards.forEach(card => {
        const name = card.querySelector("h3").innerText.toLowerCase();
        const category = (card.dataset.category || "").toLowerCase();
        const desc = (card.dataset.description || "").toLowerCase();
        if (!term || name.includes(term) || category.includes(term) || desc.includes(term)) {
            card.style.display = "";
            card.style.animation = 'none';
            card.offsetHeight;
            card.style.animation = null;
            visibleCount++;
        } else {
            card.style.display = "none";
        }
    });
    document.getElementById("item-count").innerText = `Showing ${visibleCount} Gifts`;
}

function requireLogin() {
    if (!isLoggedIn()) {
        openAuthModal("login");
        showToast("Please log in to continue.");
        return false;
    }
    return true;
}

function addToCart(id) {
    if (!requireLogin()) return;
    const card = document.querySelector(`#product-list .card[data-id="${id}"]`);
    if (!card) return;
    const product = {
        id: id,
        name: card.querySelector("h3").innerText,
        price: parseInt(card.querySelector("p").innerText.replace("₹", "").replace(/,/g, "")),
        category: card.dataset.category,
        img: card.querySelector("img").src,
        quantity: 1
    };
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push(product);
    }
    saveCart(cart);
    updateCartCount();
    showToast(product.name + " added to cart");
}

function updateCartCount() {
    const countEl = document.getElementById("cart-count");
    const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    countEl.innerText = total;
    countEl.classList.remove("cart-badge-anim");
    void countEl.offsetWidth;
    countEl.classList.add("cart-badge-anim");
}

function showToast(message) {
    let toast = document.querySelector(".toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast";
        document.body.appendChild(toast);
    }
    toast.innerHTML = message;
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(20px)";
    }, 2200);
}

function displayCart() {
    const cartDiv = document.getElementById("cart-items");
    let total = 0;
    cartDiv.innerHTML = "";

    if (cart.length === 0) {
        cartDiv.innerHTML = `
            <div class="cart-empty" style="grid-column:1/-1;">
                <div class="cart-empty-icon">Cart</div>
                <h3>Your Cart is Empty</h3>
                <p style="color:var(--text-light);">Looks like you have not added any gifts yet.</p>
            </div>`;
        document.getElementById("total").innerText = "";
        return;
    }

    cart.forEach((item, index) => {
        const qty = item.quantity || 1;
        const lineTotal = item.price * qty;
        total += lineTotal;
        cartDiv.innerHTML += `
            <div class="cart-card">
                <img src="${item.img}" alt="${item.name}" onerror="this.onerror=null;this.src=FALLBACK_IMG">
                <div class="cart-card-info">
                    <h3>${item.name}</h3>
                    <p>₹${item.price} x ${qty} = <strong>₹${lineTotal}</strong></p>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                        <span class="qty-value">${qty}</span>
                        <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
            </div>
        `;
    });
    document.getElementById("total").innerHTML = "₹" + total.toLocaleString("en-IN");
}

function changeQty(index, delta) {
    cart[index].quantity = (cart[index].quantity || 1) + delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart(cart);
    displayCart();
    updateCartCount();
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart(cart);
    displayCart();
    updateCartCount();
}

function placeOrder() {
    if (!requireLogin()) return;
    if (cart.length === 0) {
        showToast("Cart is empty!");
        return;
    }
    showPage("checkout");
}

function renderCheckoutSummary() {
    const container = document.getElementById("checkout-items");
    let total = 0;
    container.innerHTML = "";

    cart.forEach((item) => {
        const qty = item.quantity || 1;
        const lineTotal = item.price * qty;
        total += lineTotal;
        container.innerHTML += `
            <div class="checkout-item">
                <img src="${item.img}" alt="${item.name}" onerror="this.onerror=null;this.src=FALLBACK_IMG">
                <div class="checkout-item-info">
                    <h4>${item.name}</h4>
                    <p>Qty: ${qty} | ₹${lineTotal}</p>
                </div>
            </div>
        `;
    });
    document.getElementById("checkout-total").innerText = "₹" + total.toLocaleString("en-IN");
}

function autoFillCheckoutDetails() {
    const email = localStorage.getItem("giftStoreCurrentEmail") || (currentUser && currentUser.email) || "";
    const profile = email ? loadSavedProfile(email) : (currentUser || {});
    const nameEl = document.getElementById("checkout-name");
    const mobileEl = document.getElementById("checkout-mobile");
    const addressEl = document.getElementById("checkout-address");
    const cityEl = document.getElementById("checkout-city");
    const stateEl = document.getElementById("checkout-state");
    const pincodeEl = document.getElementById("checkout-pincode");
    if (nameEl && profile.name && !nameEl.value) nameEl.value = profile.name;
    if (mobileEl && profile.phone && !mobileEl.value) mobileEl.value = profile.phone;
    if (addressEl && profile.address && !addressEl.value) addressEl.value = profile.address;
    if (cityEl && profile.city && !cityEl.value) cityEl.value = profile.city;
    if (stateEl && profile.state && !stateEl.value) stateEl.value = profile.state;
    if (pincodeEl && profile.pincode && !pincodeEl.value) pincodeEl.value = profile.pincode;
    if (stateEl && profile.state) populateCitiesForCheckout();
    if (cityEl && profile.city) cityEl.value = profile.city;
}

function submitOrder() {
    savePaymentDetails();
    const name = document.getElementById("checkout-name").value.trim();
    const mobile = document.getElementById("checkout-mobile").value.trim();
    const address = document.getElementById("checkout-address").value.trim();
    const location = document.getElementById("checkout-location").value.trim();
    const city = document.getElementById("checkout-city").value.trim();
    const pincode = document.getElementById("checkout-pincode").value.trim();
    const state = document.getElementById("checkout-state").value.trim();
    const payment = document.querySelector('input[name="payment"]:checked')?.value || "";
    const upiBank = document.querySelector('input[name="upi-bank"]:checked')?.value || "";
    const cardBank = document.querySelector('input[name="card-bank"]:checked')?.value || "";
    const errorEl = document.getElementById("checkout-error");

    if (!name || !mobile || !address || !location || !city || !pincode || !state) {
        errorEl.innerText = "Please fill in all required fields.";
        errorEl.classList.add("visible");
        return;
    }

    if (!/^\d{10}$/.test(mobile)) {
        errorEl.innerText = "Please enter a valid 10-digit mobile number.";
        errorEl.classList.add("visible");
        return;
    }

    if (!/^\d{6}$/.test(pincode)) {
        errorEl.innerText = "Please enter a valid 6-digit pin code.";
        errorEl.classList.add("visible");
        return;
    }

    let paymentDetail = payment;
    if (payment === "UPI") {
        const upiBank = document.querySelector('input[name="upi-bank"]:checked')?.value || "";
        if (!upiBank) {
            errorEl.innerText = "Please select a UPI app / bank.";
            errorEl.classList.add("visible");
            return;
        }
        paymentDetail = `UPI (${upiBank})`;
    } else if (payment === "Card") {
        const cardBank = document.querySelector('input[name="card-bank"]:checked')?.value || "";
        const cardNumber = document.getElementById("card-number")?.value.trim() || "";
        const cardExpiry = document.getElementById("card-expiry")?.value.trim() || "";
        const cardCvv = document.getElementById("card-cvv")?.value.trim() || "";
        if (!cardBank || !cardNumber || !cardExpiry || !cardCvv) {
            errorEl.innerText = "Please fill in all card details.";
            errorEl.classList.add("visible");
            return;
        }
        paymentDetail = `Card (${cardBank})`;
    }

    const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

    const order = {
        order_number: "GA" + Date.now().toString().slice(-8),
        date: new Date().toISOString(),
        items: cart.map(item => ({ ...item })),
        total: total,
        payment: payment,
        paymentDetail: paymentDetail,
        name, mobile, address, location, city, state, pincode
    };
    saveOrderToStorage(order);

    showToast(`Order Placed Successfully! Total: ₹${total.toLocaleString("en-IN")} via ${paymentDetail}`);
    cart = [];
    saveCart(cart);
    displayCart();
    updateCartCount();
    setTimeout(() => showPage("home"), 1200);
}

function getOrders() {
    const raw = localStorage.getItem("giftStoreOrders");
    if (!raw) return [];
    try { return JSON.parse(raw); } catch (e) { return []; }
}

function saveOrderToStorage(order) {
    const orders = getOrders();
    orders.unshift(order);
    localStorage.setItem("giftStoreOrders", JSON.stringify(orders));
}

function getEstimatedDelivery(orderDate) {
    const date = new Date(orderDate);
    date.setDate(date.getDate() + 5 + Math.floor(Math.random() * 3));
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function getTrackingStatus(orderDate) {
    const now = new Date();
    const order = new Date(orderDate);
    const hoursDiff = (now - order) / (1000 * 60 * 60);

    const steps = [
        { key: "placed", title: "Order Placed", hours: 0 },
        { key: "confirmed", title: "Order Confirmed", hours: 4 },
        { key: "shipped", title: "Shipped", hours: 24 },
        { key: "out", title: "Out for Delivery", hours: 72 },
        { key: "delivered", title: "Delivered", hours: 120 }
    ];

    let currentIndex = 0;
    for (let i = steps.length - 1; i >= 0; i--) {
        if (hoursDiff >= steps[i].hours) {
            currentIndex = i;
            break;
        }
    }

    const trackingSteps = steps.map((step, idx) => ({
        title: step.title,
        date: idx <= currentIndex ? new Date(order.getTime() + step.hours * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null,
        completed: idx < currentIndex,
        active: idx === currentIndex
    }));

    return {
        status: steps[currentIndex].key,
        currentIndex,
        trackingSteps
    };
}

function showOrdersPage() {
    const homePage = document.getElementById("home-page");
    if (homePage) homePage.classList.add("hidden");
    const cartPage = document.getElementById("cart-page");
    if (cartPage) cartPage.classList.add("hidden");
    const productDetail = document.getElementById("product-detail");
    if (productDetail) productDetail.classList.add("hidden");
    const hero = document.getElementById("hero-section");
    if (hero) hero.classList.add("hidden");
    const checkoutPage = document.getElementById("checkout-page");
    if (checkoutPage) checkoutPage.classList.add("hidden");
    const profilePage = document.getElementById("profile-page");
    if (profilePage) profilePage.classList.add("hidden");
    const ordersPage = document.getElementById("orders-page");
    if (ordersPage) ordersPage.classList.remove("hidden");
    renderOrders();
    window.scrollTo(0, 0);
}

function cancelOrder(index) {
    const orders = getOrders();
    if (index >= 0 && index < orders.length) {
        orders.splice(index, 1);
        localStorage.setItem("giftStoreOrders", JSON.stringify(orders));
        renderOrders();
    }
}

function renderOrders() {
    const container = document.getElementById("orders-container");
    const orders = getOrders();

    if (!orders || orders.length === 0) {
        container.innerHTML = `
            <div class="no-orders">
                <div class="no-orders-icon">📦</div>
                <h3>No Orders Yet</h3>
                <p style="color:var(--text-light);">Your order history will appear here after you place your first order.</p>
            </div>`;
        return;
    }

    container.innerHTML = "";

    for (const order of orders) {
        const tracking = getTrackingStatus(order.date);
        const estimatedDelivery = getEstimatedDelivery(order.date);

        let itemsHtml = "";
        order.items.forEach(item => {
            itemsHtml += `
                <div class="order-item">
                    <img src="${item.img}" alt="${item.name}" onerror="this.onerror=null;this.src=FALLBACK_IMG">
                    <div class="order-item-info">
                        <h4>${item.name}</h4>
                        <p>Qty: ${item.quantity || 1} | ₹${item.price}</p>
                    </div>
                </div>`;
        });

        let timelineHtml = "";
        tracking.trackingSteps.forEach(step => {
            timelineHtml += `
                <div class="tracking-step ${step.completed ? "completed" : ""} ${step.active ? "active" : ""}">
                    <div class="tracking-dot"></div>
                    <div class="tracking-step-content">
                        <div class="tracking-step-title">${step.title}</div>
                        <div class="tracking-step-date">${step.date || "Pending"}</div>
                    </div>
                </div>`;
        });

        container.innerHTML += `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-id">Order #${order.order_number}</div>
                        <div class="order-date">${new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
                    </div>
                    <div class="order-total">₹${order.total.toLocaleString("en-IN")}</div>
                </div>
                <div class="order-items">
                    ${itemsHtml}
                </div>
                <div class="tracking-section">
                    <div class="tracking-title">Track Order</div>
                    <div class="tracking-timeline">
                        ${timelineHtml}
                    </div>
                    <div class="delivery-estimate">
                        🚚 Order Delivery Date: <strong>${estimatedDelivery}</strong>
                    </div>
                </div>
                <button class="order-cancel-btn" onclick="cancelOrder(${orders.indexOf(order)})">Cancel Order</button>
            </div>`;
    };
}

let currentDetailId = null;

function openProductDetail(id) {
    if (!requireLogin()) return;
    const card = document.querySelector(`#product-list .card[data-id="${id}"]`);
    if (!card) return;
    currentDetailId = id;

    document.getElementById("detail-img").src = card.querySelector("img").src;
    document.getElementById("detail-img").alt = card.querySelector("h3").innerText;
    document.getElementById("detail-name").innerText = card.querySelector("h3").innerText;
    document.getElementById("detail-category").innerText = card.dataset.category;
    document.getElementById("detail-price").innerText = card.querySelector("p").innerText;
    document.getElementById("detail-description").innerText = card.dataset.description || "";

    const ratingEl = document.getElementById("detail-rating");
    if (card.dataset.rating) {
        const r = parseFloat(card.dataset.rating);
        const full = Math.round(r);
        ratingEl.innerHTML = `${"★".repeat(full)}${"☆".repeat(5 - full)}  ${r} / 5`;
    } else {
        ratingEl.innerHTML = "";
    }

    const featuresEl = document.getElementById("detail-features");
    featuresEl.innerHTML = "";
    let features = [];
    try { features = JSON.parse(card.dataset.features || "[]"); } catch (e) { features = []; }
    features.forEach(f => {
        const li = document.createElement("li");
        li.innerText = f;
        featuresEl.appendChild(li);
    });

    const homePage = document.getElementById("home-page");
    if (homePage) homePage.classList.add("hidden");
    const cartPage = document.getElementById("cart-page");
    if (cartPage) cartPage.classList.add("hidden");
    const hero = document.getElementById("hero-section");
    if (hero) hero.classList.add("hidden");
    const productDetail = document.getElementById("product-detail");
    if (productDetail) productDetail.classList.remove("hidden");
    window.scrollTo(0, 0);
}

function hideProductDetail() {
    const hero = document.getElementById("hero-section");
    if (hero) hero.classList.remove("hidden");
    const homePage = document.getElementById("home-page");
    if (homePage) homePage.classList.remove("hidden");
    const productDetail = document.getElementById("product-detail");
    if (productDetail) productDetail.classList.add("hidden");
    window.scrollTo(0, 0);
}

function addToCartFromDetail() {
    if (currentDetailId) addToCart(currentDetailId);
}

function placeDirectOrder(id) {
    if (!requireLogin()) return;
    const card = document.querySelector(`.card[data-id="${id}"]`);
    if (!card) return;
    const product = {
        id: id,
        name: card.querySelector("h3").innerText,
        price: parseInt(card.querySelector("p").innerText.replace("₹", "").replace(/,/g, "")),
        category: card.dataset.category,
        img: card.querySelector("img").src,
        quantity: 1
    };
    cart = [product];
    saveCart(cart);
    updateCartCount();
    showPage("checkout");
    renderCheckoutSummary();
    populateStateDropdowns();
    autoFillCheckoutDetails();
    loadPaymentDetails();
    togglePaymentSections();
}

function addPlaceOrderButtons() {
    document.querySelectorAll(".card").forEach(card => {
        if (card.querySelector(".place-order-btn")) return;
        const id = card.dataset.id;
        const btn = document.createElement("button");
        btn.className = "place-order-btn";
        btn.innerText = "Place Order";
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            placeDirectOrder(id);
        });
        card.appendChild(btn);
    });
}

function attachCardClicks() {
    document.querySelectorAll("#product-list .card").forEach(card => {
        card.addEventListener("click", e => {
            if (e.target.tagName === "BUTTON") return;
            openProductDetail(card.dataset.id);
        });
    });
}

function getLocation(fieldId) {
    if (!navigator.geolocation) {
        showToast("Geolocation is not supported by your browser");
        return;
    }
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.value = "Fetching location...";
    navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const url = "https://www.google.com/maps?q=" + lat + "," + lng;
        field.value = url;
        fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lng + '&addressdetails=1', {
            headers: { 'User-Agent': 'GiftStoreApp/1.0' }
        })
            .then(function (response) { return response.json(); })
            .then(function (data) {
                if (data.address) {
                    const addr = data.address;
                    const city = addr.city || addr.town || addr.village || '';
                    const state = addr.state || '';
                    const postcode = addr.postcode || '';
                    const profilePage = document.getElementById('profile-page');
                    const checkoutPage = document.getElementById('checkout-page');
                    if (checkoutPage && !checkoutPage.classList.contains('hidden')) {
                        const stateSel = document.getElementById('checkout-state');
                        const citySel = document.getElementById('checkout-city');
                        const pinSel = document.getElementById('checkout-pincode');
                        if (stateSel) stateSel.value = state;
                        populateCitiesForCheckout();
                        if (citySel) citySel.value = city;
                        if (pinSel) pinSel.value = postcode;
                    } else if (profilePage && !profilePage.classList.contains('hidden')) {
                        const stateSel = document.getElementById('profile-state');
                        const citySel = document.getElementById('profile-city');
                        const pinSel = document.getElementById('profile-pincode');
                        if (stateSel) stateSel.value = state;
                        populateCitiesForProfile();
                        if (citySel) citySel.value = city;
                        if (pinSel) pinSel.value = postcode;
                    }
                }
                showToast("Location & address details filled!");
            })
            .catch(function () {
                showToast("Location fetched! Address details may be incomplete.");
            });
    }, function (error) {
        field.value = "";
        if (error.code === 1) {
            showToast("Location access denied. Please allow location permission.");
        } else if (error.code === 2) {
            showToast("Location unavailable. Please try again.");
        } else {
            showToast("Error getting location. Please try again.");
        }
    }, { enableHighAccuracy: true, timeout: 10000 });
}

function autoFillFromUPI() {
    const upiId = document.getElementById("upi-id").value.trim();
    const nameEl = document.getElementById("upi-name");
    const mobileEl = document.getElementById("upi-mobile");
    if (!nameEl || !mobileEl) return;

    if (upiId.length >= 3) {
        const email = localStorage.getItem("giftStoreCurrentEmail") || (currentUser && currentUser.email) || "";
        const profile = email ? loadSavedProfile(email) : (currentUser || {});
        if (profile.name && !nameEl.value) nameEl.value = profile.name;
        if (profile.phone && !mobileEl.value) mobileEl.value = profile.phone;
    }
}

function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, "");
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    input.value = value.substring(0, 19);
}

function formatExpiry(input) {
    let value = input.value.replace(/\D/g, "");
    if (value.length >= 2) {
        value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    input.value = value;
}

function savePaymentDetails() {
    const upiId = document.getElementById("upi-id")?.value || "";
    const upiName = document.getElementById("upi-name")?.value || "";
    const upiMobile = document.getElementById("upi-mobile")?.value || "";
    const cardNumber = document.getElementById("card-number")?.value || "";
    const cardName = document.getElementById("card-name")?.value || "";
    const cardExpiry = document.getElementById("card-expiry")?.value || "";
    const upiBank = document.querySelector('input[name="upi-bank"]:checked')?.value || "";
    const cardBank = document.querySelector('input[name="card-bank"]:checked')?.value || "";
    localStorage.setItem("giftStorePaymentDetails", JSON.stringify({ upiId, upiName, upiMobile, cardNumber, cardName, cardExpiry, upiBank, cardBank }));
}

function loadPaymentDetails() {
    const raw = localStorage.getItem("giftStorePaymentDetails");
    if (!raw) return;
    try {
        const data = JSON.parse(raw);
        if (!data) return;
        const upiIdEl = document.getElementById("upi-id");
        const upiNameEl = document.getElementById("upi-name");
        const upiMobileEl = document.getElementById("upi-mobile");
        const cardNumberEl = document.getElementById("card-number");
        const cardNameEl = document.getElementById("card-name");
        const cardExpiryEl = document.getElementById("card-expiry");
        if (upiIdEl && data.upiId) upiIdEl.value = data.upiId;
        if (upiNameEl && data.upiName) upiNameEl.value = data.upiName;
        if (upiMobileEl && data.upiMobile) upiMobileEl.value = data.upiMobile;
        if (cardNumberEl && data.cardNumber) cardNumberEl.value = data.cardNumber;
        if (cardNameEl && data.cardName) cardNameEl.value = data.cardName;
        if (cardExpiryEl && data.cardExpiry) cardExpiryEl.value = data.cardExpiry;
        if (data.upiBank) {
            const upiRadio = document.querySelector(`input[name="upi-bank"][value="${data.upiBank}"]`);
            if (upiRadio) upiRadio.checked = true;
        }
        if (data.cardBank) {
            const cardRadio = document.querySelector(`input[name="card-bank"][value="${data.cardBank}"]`);
            if (cardRadio) cardRadio.checked = true;
        }
    } catch (e) { return; }
}

function togglePaymentSections() {
    const payment = document.querySelector('input[name="payment"]:checked')?.value || "";
    const sections = ["upi-section", "card-section"];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add("hidden");
    });
    if (payment === "UPI") {
        const upiSection = document.getElementById("upi-section");
        upiSection.classList.remove("hidden");
        autoFillFromUPI();
    } else if (payment === "Card") {
        const cardSection = document.getElementById("card-section");
        cardSection.classList.remove("hidden");
        const email = localStorage.getItem("giftStoreCurrentEmail") || (currentUser && currentUser.email) || "";
        const profile = email ? loadSavedProfile(email) : (currentUser || {});
        const cardNameEl = document.getElementById("card-name");
        if (cardNameEl && profile.name && !cardNameEl.value) cardNameEl.value = profile.name;
    }
    savePaymentDetails();
}

function initPaymentListeners() {
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener("change", function () {
            togglePaymentSections();
            savePaymentDetails();
        });
    });
    const paymentInputs = document.querySelectorAll('#upi-section input, #card-section input');
    paymentInputs.forEach(input => {
        input.addEventListener("input", savePaymentDetails);
        input.addEventListener("change", savePaymentDetails);
    });
}

attachCardClicks();
updateCartCount();
initPaymentListeners();
addPlaceOrderButtons();

const deliveryProducts = [
    { id: 1, name: "Birthday Cake", price: 599, category: "Birthday", img: "images/cake.jpg", rating: "4.7", description: "Soft, freshly baked eggless birthday cake with creamy vanilla frosting and cheerful sprinkles.", features: ["Eggless & freshly baked", "Serves 4-6 people", "Same-day delivery available", "100% vegetarian"], type: "eatable" },
    { id: 5, name: "Chocolate Box", price: 399, category: "Birthday", img: "images/chocolate.jpg", rating: "4.7", description: "A luxurious box of assorted Belgian chocolates with ganache fillings.", features: ["Assorted flavours", "Premium gift packaging", "Shelf life 6 months", "Hand-crafted Belgian chocolates"], type: "eatable" },
    { id: 7, name: "Chocolate Truffle Cake", price: 649, category: "Birthday", img: "images/chocolate truffle cake.jfif", rating: "4.5", description: "A rich and moist chocolate truffle cake layered with dark ganache.", features: ["Eggless option available", "Serves 4-6", "Chilled delivery", "Dark chocolate ganache"], type: "eatable" },
    { id: 13, name: "Cupcake Box 6pc", price: 349, category: "Birthday", img: "images/Cupcake Box 6pc.jfif", rating: "4.6", description: "A box of 6 freshly baked cupcakes in assorted flavours.", features: ["Box of 6 cupcakes", "Multiple flavours", "Freshly baked", "Eggless option"], type: "eatable" },
    { id: 26, name: "Cake Pop Set", price: 399, category: "Birthday", img: "images/cake pop set.jfif", rating: "4.1", description: "A DIY cake pop set with sticks, wrappers and decorating supplies.", features: ["Pack of 12 sticks", "Decorating wraps", "Reusable mold", "Recipe booklet"], type: "eatable" },
    { id: 54, name: "Snack Hamper", price: 549, category: "Festival", img: "images/snack hamper.jfif", rating: "4.2", description: "A snack hamper packed with chips, nuts, cookies and more.", features: ["10 snack items", "Sealed packs", "Gift wrapped", "Variety pack"], type: "eatable" },
    { id: 79, name: "Heart Shape Red Cake", price: 749, category: "Anniversary", img: "images/Heart Shape Red Cake.jfif", rating: "4.7", description: "A luscious heart-shaped red velvet cake with creamy frosting.", features: ["Heart shaped", "Serves 4-6", "Eggless option", "Rich cocoa"], type: "eatable" },
    { id: 80, name: "Chocolate", price: 1299, category: "Anniversary", img: "images/Chocolate.jfif", rating: "4.6", description: "A box of premium assorted Belgian chocolates for a sweet romantic surprise.", features: ["12 pieces", "Belgian cocoa", "Gift boxed", "Hand-crafted"], type: "eatable" },
    { id: 136, name: "Assorted Sweets 1kg", price: 699, category: "Festival", img: "images/Assorted Sweets 1kg.jfif", rating: "4.4", description: "A 1kg box of assorted Indian sweets for festive sharing.", features: ["1 kg pack", "Fresh made", "Mixed sweets"], type: "eatable" },
    { id: 137, name: "Dry Fruits Gift Box", price: 1299, category: "Festival", img: "images/Dry Fruits Gift Box.jfif", rating: "4.5", description: "A premium dry fruits gift box with almonds, cashews and raisins.", features: ["1 kg assorted", "Premium nuts", "Gift tin"], type: "eatable" },
    { id: 162, name: "Sugarcane", price: 199, category: "Festival", img: "images/Sugarcane.jfif", rating: "4.0", description: "Fresh sugarcane stalks to celebrate Pongal and Makar Sankranti.", features: ["Fresh stalks", "Farm sourced", "Seasonal"], type: "eatable" },
    { id: 163, name: "Onam Sadhya Box", price: 1499, category: "Festival", img: "images/onam Sadhya pack.jfif", rating: "4.3", description: "An Onam Sadhya box with a banana-leaf style feast assortment.", features: ["Assorted dishes", "Festive pack", "Serves 2"], type: "eatable" },
    { id: 166, name: "Modak Sweet Box", price: 499, category: "Festival", img: "images/Modak.jfif", rating: "4.3", description: "A Modak sweet box, lord Ganesha's favourite festive treat.", features: ["12 pieces", "Ukadiche style", "Sweet filling"], type: "eatable" },
    { id: 186, name: "Festive Feast Box", price: 1999, category: "Festival", img: "images/Festive Feast Box.jfif", rating: "4.3", description: "A festive feast box with a curated spread of delicacies.", features: ["Assorted dishes", "Serves 4", "Gift packed"], type: "eatable" },
    { id: 196, name: "Premium Festival Hamper", price: 2999, category: "Festival", img: "images/Premium Festival Hamper.jfif", rating: "4.5", description: "A premium festival hamper with sweets, dry fruits and decor.", features: ["Luxury tin", "Assorted items", "Gift packed"], type: "eatable" },
    { id: 2, name: "Rose Bouquet", price: 349, category: "Anniversary", img: "images/rose.jpg", rating: "4.8", description: "A hand-tied bouquet of 12 fresh red roses wrapped in premium floral paper.", features: ["12 fresh long-stem roses", "Elegant floral wrapping", "Express delivery", "Includes greeting card"], type: "non-eatable" },
    { id: 24, name: "Birthday Crown Cap", price: 129, category: "Birthday", img: "images/birthday crown cap.jfif", rating: "4.2", description: "A fun glittery birthday crown cap to make the birthday star feel extra special.", features: ["Adjustable fit", "Glitter finish", "Reusable", "Pack of 1 cap"], type: "non-eatable" },
    { id: 29, name: "Pen Set", price: 499, category: "Birthday", img: "images/pen set.jfif", rating: "4.3", description: "An elegant pen set with a ballpoint and roller pen in a gift box.", features: ["2 pens included", "Gift boxed", "Smooth writing", "Premium packaging"], type: "non-eatable" },
    { id: 53, name: "Gift Basket", price: 999, category: "Festival", img: "images/gift basket.jfif", rating: "4.3", description: "A ready-to-gift wicker basket filled with assorted goodies.", features: ["Assorted treats", "Wicker basket", "Reusable", "Gift wrapped"], type: "non-eatable" },
    { id: 56, name: "Party Hat Pack", price: 59, category: "Birthday", img: "images/Party Hat Pack.jfif", rating: "4.0", description: "A pack of 10 colourful party hats with elastic strings.", features: ["Pack of 10", "Elastic string", "Bright prints", "One size"], type: "non-eatable" },
    { id: 61, name: "Money Plant", price: 399, category: "Festival", img: "images/money plant.jfif", rating: "4.4", description: "A low-maintenance money plant in a ceramic pot.", features: ["Live plant", "Air purifying", "Easy care", "Gifting pot included"], type: "non-eatable" },
    { id: 73, name: "100 Red Roses Bouquet", price: 1499, category: "Anniversary", img: "images/100 roses bouquet.jfif", rating: "4.8", description: "A grand bouquet of 100 fresh red roses arranged in a luxury gift box.", features: ["100 fresh roses", "Luxury wrap", "Midnight delivery", "Gift boxed"], type: "non-eatable" },
    { id: 104, name: "Photo Booth Props", price: 4999, category: "Anniversary", img: "images/Photo Booth Props.jfif", rating: "4.1", description: "A fun photo booth props kit for memorable party pictures.", features: ["Pack of 20 props", "Sticks included", "Reusable"], type: "non-eatable" },
    { id: 105, name: "Acrylic Cake Topper", price: 199, category: "Anniversary", img: "images/Acrylic Cake Topper.jfif", rating: "4.2", description: "An acrylic cake topper with a custom name to crown celebration cakes.", features: ["Custom text", "Food safe acrylic", "Reusable"], type: "non-eatable" },
    { id: 145, name: "Chocolate Rakhi", price: 299, category: "Festival", img: "images/Chocolate Rakhi.jfif", rating: "4.2", description: "A delicious chocolate Rakhi combining tradition with a sweet treat.", features: ["Chocolate rakhi", "Gift packed", "With roli"], type: "non-eatable" },
    { id: 155, name: "New Year Party Kit", price: 1599, category: "Festival", img: "images/New Year Party Kit.jfif", rating: "4.2", description: "A New Year party kit with hats, blowers and decor.", features: ["20 piece kit", "Reusable", "Festive"], type: "non-eatable" },
    { id: 156, name: "E-id Gift Box", price: 1899, category: "Festival", img: "images/E-id Gift Pack.jfif", rating: "4.4", description: "An Eid gift box with dates, attar and festive treats.", features: ["Assorted items", "Gift packed", "Premium"], type: "non-eatable" },
    { id: 164, name: "Marigold Garland", price: 299, category: "Festival", img: "images/Marigold Garland.jfif", rating: "4.2", description: "A marigold garland to decorate homes and temples festively.", features: ["Fresh flowers", "Hand strung", "Fragrant"], type: "non-eatable" },
    { id: 182, name: "Incense Sticks", price: 99, category: "Festival", img: "images/Incense Sticks.jfif", rating: "4.3", description: "A pack of natural incense sticks for a calming aroma.", features: ["Pack of 50", "Natural", "Long stick"], type: "non-eatable" },
    { id: 183, name: "Pure Camphor", price: 149, category: "Festival", img: "images/Camphor Box.jfif", rating: "4.1", description: "A camphor box for daily aarti and fragrant puja rituals.", features: ["Pack of 50", "Pure camphor", "Easy light"], type: "non-eatable" },
    { id: 200, name: "Globe", price: 999, category: "Festival", img: "images/Globe.jfif", rating: "4.1", description: "A decorative globe with geographical detail for study and decor.", features: ["Rotating", "LED base", "Detailed map"], type: "non-eatable" }
];

let currentDeliveryType = "all";
let currentDeliveryCat = "All";

function renderDeliveryProducts() {
    const container = document.getElementById("ten-minute-product-list");
    if (!container) return;
    container.innerHTML = "";
    let filtered = deliveryProducts;
    if (currentDeliveryType !== "all") {
        filtered = filtered.filter(p => p.type === currentDeliveryType);
    }
    if (currentDeliveryCat !== "All") {
        filtered = filtered.filter(p => p.category === currentDeliveryCat);
    }
    document.getElementById("ten-minute-item-count").innerText = `Showing ${filtered.length} Items`;
    filtered.forEach(product => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("data-category", product.category);
        card.setAttribute("data-id", product.id);
        card.setAttribute("data-rating", product.rating);
        card.setAttribute("data-description", product.description);
        card.setAttribute("data-features", JSON.stringify(product.features));
        card.innerHTML = `
            <img src="${product.img}" alt="${product.name}" onerror="this.onerror=null;this.src=FALLBACK_IMG">
            <h3>${product.name}</h3>
            <p>₹${product.price}</p>
            <button onclick="event.stopPropagation();addToCart(${product.id})">Add to Cart</button>
            <button class="place-order-btn" onclick="event.stopPropagation();placeDirectOrder(${product.id})">Place Order</button>
        `;
        card.addEventListener("click", e => {
            if (e.target.tagName === "BUTTON") return;
            openProductDetail(product.id);
        });
        container.appendChild(card);
    });
}

function showDeliveryCategory(type) {
    currentDeliveryType = type;
    currentDeliveryCat = "All";
    renderDeliveryProducts();
    const tenHome = document.getElementById("ten-minute-home");
    if (tenHome) tenHome.scrollIntoView({ behavior: "smooth" });
}

function filterDeliveryCat(cat) {
    if (!requireLogin()) return;
    currentDeliveryCat = cat;
    renderDeliveryProducts();
}

function initParticles() {
    const container = document.getElementById("floating-particles");
    if (!container) return;
    const colors = ["rgba(79,70,229,0.35)", "rgba(190,18,60,0.3)", "rgba(217,119,6,0.3)", "rgba(5,150,105,0.3)"];
    for (let i = 0; i < 18; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        const size = Math.random() * 8 + 4;
        particle.style.width = size + "px";
        particle.style.height = size + "px";
        particle.style.left = Math.random() * 100 + "%";
        particle.style.top = Math.random() * 100 + "%";
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDuration = (Math.random() * 8 + 8) + "s";
        particle.style.animationDelay = (Math.random() * 5) + "s";
        container.appendChild(particle);
    }
}

function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal-visible");
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll(".order-card, .profile-container, .detail-container, .checkout-form, .order-summary, .profile-header, .filter, .hero-actions, .cart-total-bar, .payment-detail").forEach(el => {
        el.classList.add("reveal");
        observer.observe(el);
    });
}

function initApp() {
    populateStateDropdowns();
    window.addEventListener("scroll", () => {
        const header = document.getElementById("main-header");
        if (header) {
            if (window.scrollY > 10) header.classList.add("scrolled");
            else header.classList.remove("scrolled");
        }
    });
    if (isLoggedIn()) {
        currentUser = loadSavedProfile(localStorage.getItem("giftStoreCurrentEmail")) || currentUser;
        setTheme(getTheme());
    }
    updateProfileMenu();
    renderProfile();
    applyActiveNav("home");
    document.addEventListener("click", function (e) {
        const profileBar = document.getElementById("profile-bar");
        const dropdown = document.getElementById("profile-dropdown");
        if (profileBar && dropdown && !profileBar.contains(e.target)) {
            dropdown.classList.remove("open");
        }
    });
    initParticles();
    initScrollReveal();
}

initApp();

const cursorCircle = document.createElement("div");
cursorCircle.className = "cursor-circle";
document.body.appendChild(cursorCircle);

const cursorDot = document.createElement("div");
cursorDot.className = "cursor-dot";
document.body.appendChild(cursorDot);

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let circleX = mouseX;
let circleY = mouseY;

document.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + "px";
    cursorDot.style.top = mouseY + "px";

    const trail = document.createElement("div");
    trail.className = "cursor-trail";
    trail.style.left = mouseX + "px";
    trail.style.top = mouseY + "px";
    const size = 3 + Math.random() * 5;
    trail.style.width = size + "px";
    trail.style.height = size + "px";
    trail.style.background = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#a855f7", "#f43f5e", "#06b6d4"][Math.floor(Math.random() * 8)];
    document.body.appendChild(trail);
    setTimeout(function () {
        if (trail.parentNode) {
            trail.parentNode.removeChild(trail);
        }
    }, 600);
});

function animateCursor() {
    circleX += (mouseX - circleX) * 0.15;
    circleY += (mouseY - circleY) * 0.15;
    cursorCircle.style.left = circleX + "px";
    cursorCircle.style.top = circleY + "px";
    requestAnimationFrame(animateCursor);
}
animateCursor();

document.addEventListener("mouseenter", function () {
    cursorCircle.style.opacity = "1";
    cursorDot.style.opacity = "1";
});

document.addEventListener("mouseleave", function () {
    cursorCircle.style.opacity = "0";
    cursorDot.style.opacity = "0";
});

const interactiveElements = document.querySelectorAll("a, button, .card, .header-nav-item, .header-profile, .theme-toggle, .header-mobile-toggle, .filter-btn, .delivery-cat-btn, .quick-delivery-btn, input, textarea, select, .payment-option, .payment-detail-option, .location-btn, .profile-dropdown-item, .auth-modal-close, .order-btn, .order-cancel-btn, .checkout-actions .back-btn, .profile-save-btn, .profile-delete-btn, .card button, .remove-btn, .place-order-btn");
interactiveElements.forEach(function (el) {
    el.addEventListener("mouseenter", function () {
        cursorCircle.style.width = "48px";
        cursorCircle.style.height = "48px";
        cursorCircle.style.borderColor = "#ec4899";
    });
    el.addEventListener("mouseleave", function () {
        cursorCircle.style.width = "32px";
        cursorCircle.style.height = "32px";
        cursorCircle.style.borderColor = "#6366f1";
    });
});