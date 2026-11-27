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
let wishlist = [];
let currentSort = "default";
let currentBudgetMax = null;
let appliedCoupon = null;
let currentUser = null;

const COUPON_CODES = {
    "BLOOM10": { type: "percent", value: 10, description: "10% off on all orders" },
    "FIRST100": { type: "flat", value: 100, description: "₹100 off on first order", minOrder: 500 },
    "WELCOME50": { type: "flat", value: 50, description: "₹50 off", minOrder: 300 },
    "GIFT20": { type: "percent", value: 20, description: "20% off on gifts above ₹1000", minOrder: 1000 }
};

function getWishlistKey() {
    const email = localStorage.getItem("giftStoreCurrentEmail") || (currentUser && currentUser.email) || "";
    return "giftStoreWishlist_" + (email ? email.replace(/[^a-zA-Z0-9]/g, "_") : "guest");
}

function loadWishlist() {
    const key = getWishlistKey();
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    try { return JSON.parse(raw); } catch (e) { return []; }
}

function saveWishlist() {
    const key = getWishlistKey();
    localStorage.setItem(key, JSON.stringify(wishlist));
    updateWishlistCount();
}

function updateWishlistCount() {
    const countEl = document.getElementById("wishlist-count");
    if (countEl) countEl.innerText = wishlist.length;
}

function isInWishlist(id) {
    return wishlist.some(item => item.id === id);
}

function toggleWishlist(id) {
    if (!requireLogin()) return;
    const index = wishlist.findIndex(item => item.id === id);
    if (index >= 0) {
        wishlist.splice(index, 1);
        showToast("Removed from wishlist");
    } else {
        const card = document.querySelector(`#product-list .card[data-id="${id}"]`) || document.querySelector(`#ten-minute-product-list .card[data-id="${id}"]`);
        if (card) {
            const product = {
                id: id,
                name: card.querySelector("h3").innerText,
                price: parseInt(card.querySelector("p").innerText.replace("₹", "").replace(/,/g, "")),
                category: card.dataset.category,
                img: card.querySelector("img").src,
                rating: card.dataset.rating,
                description: card.dataset.description,
                features: card.dataset.features
            };
            wishlist.push(product);
            showToast("Added to wishlist");
        }
    }
    saveWishlist();
    updateWishlistButtons();
    const wishlistPage = document.getElementById("wishlist-page");
    if (wishlistPage && !wishlistPage.classList.contains("hidden")) {
        renderWishlist();
    }
}

function updateWishlistButtons() {
    document.querySelectorAll(".wishlist-btn").forEach(btn => {
        const id = parseInt(btn.getAttribute("onclick").match(/toggleWishlist\((\d+)\)/)?.[1] || "0");
        if (isInWishlist(id)) {
            btn.classList.add("active");
            btn.querySelector("i").classList.remove("fa-regular");
            btn.querySelector("i").classList.add("fa-solid");
        } else {
            btn.classList.remove("active");
            btn.querySelector("i").classList.remove("fa-solid");
            btn.querySelector("i").classList.add("fa-regular");
        }
    });
}

function addWishlistButtonsToCards() {
    document.querySelectorAll("#product-list .card, #ten-minute-product-list .card").forEach(card => {
        if (card.querySelector(".wishlist-btn")) return;
        const id = card.dataset.id;
        if (!id) return;
        const img = card.querySelector("img");
        if (!img) return;
        const btn = document.createElement("button");
        btn.className = "wishlist-btn";
        btn.setAttribute("onclick", `event.stopPropagation();toggleWishlist(${id})`);
        btn.setAttribute("aria-label", "Add to wishlist");
        btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
        card.insertBefore(btn, img.nextSibling);
    });
    updateWishlistButtons();
}

function renderWishlist() {
    const container = document.getElementById("wishlist-items");
    if (!container) return;

    container.innerHTML = "";

    if (wishlist.length === 0) {
        container.innerHTML = `
            <div class="cart-empty wishlist-empty">
                <div class="cart-empty-icon"><i class="fa-regular fa-heart"></i></div>
                <h3>Your Wishlist is Empty</h3>
                <p>Tap the heart on any gift to save it here.</p>
                <button class="order-btn" onclick="showPage('home')">Explore Gifts</button>
            </div>`;
        updateWishlistCount();
        return;
    }

    wishlist.forEach(product => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("data-category", product.category || "");
        card.setAttribute("data-id", product.id);
        card.setAttribute("data-rating", product.rating || "");
        card.setAttribute("data-description", product.description || "");
        card.setAttribute("data-features", typeof product.features === "string" ? product.features : JSON.stringify(product.features || []));
        card.innerHTML = `
            <img src="${product.img}" alt="${product.name}" onerror="this.onerror=null;this.src=FALLBACK_IMG">
            <button class="wishlist-btn active" onclick="event.stopPropagation();toggleWishlist(${product.id})" aria-label="Remove from wishlist">
                <i class="fa-solid fa-heart"></i>
            </button>
            <h3>${product.name}</h3>
            <p>₹${product.price}</p>
            <button onclick="event.stopPropagation();addToCart(${product.id})">Add to Cart</button>
        `;
        container.appendChild(card);
    });

    updateWishlistButtons();
    updateWishlistCount();
}

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
        wishlist = loadWishlist();
        updateWishlistCount();
        updateWishlistButtons();
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
    wishlist = loadWishlist();
    updateWishlistCount();
    updateWishlistButtons();
    updateProfileMenu();
    renderProfile();
    showToast("Account created successfully! Welcome, " + name + "!");
}

function logout() {
    currentUser = null;
    localStorage.removeItem("giftStoreUser");
    localStorage.removeItem("giftStoreCurrentEmail");
    wishlist = [];
    updateWishlistCount();
    updateWishlistButtons();
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
        localStorage.removeItem(getWishlistKey());
    }
    localStorage.removeItem("giftStoreUser");
    localStorage.removeItem("giftStoreCurrentEmail");
    const users = getUsers().filter(u => u.email !== email);
    saveUsers(users);
    const orders = getOrders().filter(o => o.name !== (currentUser && currentUser.name));
    localStorage.setItem("giftStoreOrders", JSON.stringify(orders));
    currentUser = null;
    wishlist = [];
    cart = [];
    saveCart(cart);
    updateCartCount();
    updateWishlistCount();
    updateWishlistButtons();
    updateProfileMenu();
    renderProfile();
    showPage("home");
    showToast("Account deleted successfully.");
}

function showProfilePage() {
    const homePage = document.getElementById("home-page");
    if (homePage) homePage.classList.add("hidden");
    const wishlistPage = document.getElementById("wishlist-page");
    if (wishlistPage) wishlistPage.classList.add("hidden");
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
    if (page === "wishlist" && !requireLogin()) return;
    const pages = ["home-page", "wishlist-page", "cart-page", "product-detail", "hero-section", "checkout-page", "profile-page", "orders-page", "ten-minute-page", "ten-minute-home"];
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
    if (page === "wishlist") {
        renderWishlist();
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
    const activeItem = nav.querySelector(`.header-nav-item[data-page="${page}"]`);
    if (activeItem) activeItem.classList.add("active");
}

function showEmptyStateIfNeeded(visibleCount) {
    const productList = document.getElementById("product-list");
    if (!productList) return;
    let emptyState = document.getElementById("empty-state");
    if (visibleCount === 0) {
        if (!emptyState) {
            emptyState = document.createElement("div");
            emptyState.id = "empty-state";
            emptyState.className = "empty-state";
            emptyState.innerHTML = `
                <div class="empty-state-icon">🎁</div>
                <h3>No Gifts Found</h3>
                <p>Try adjusting your search or filters to find the perfect gift.</p>
                <button class="reset-filters-btn" onclick="resetAllFilters()">Reset All Filters</button>
            `;
            productList.parentNode.insertBefore(emptyState, productList.nextSibling);
        }
        emptyState.style.display = "flex";
    } else {
        if (emptyState) {
            emptyState.style.display = "none";
        }
    }
}

function resetAllFilters() {
    document.getElementById("search-input").value = "";
    document.getElementById("sort-select").value = "default";
    currentSort = "default";
    document.querySelectorAll(".budget-pill").forEach(pill => {
        pill.classList.remove("active");
        if (pill.dataset.max === "") pill.classList.add("active");
    });
    currentBudgetMax = null;
    filterCat("All");
    const emptyState = document.getElementById("empty-state");
    if (emptyState) emptyState.style.display = "none";
}

function applySort(sortValue) {
    currentSort = sortValue;
    renderFilteredProducts();
}

function applyBudgetFilter(maxPrice) {
    currentBudgetMax = maxPrice;
    document.querySelectorAll(".budget-pill").forEach(pill => {
        pill.classList.remove("active");
        if ((maxPrice === null && pill.dataset.max === "") || (maxPrice !== null && parseInt(pill.dataset.max) === maxPrice)) {
            pill.classList.add("active");
        }
    });
    renderFilteredProducts();
}

function renderFilteredProducts() {
    let cards = document.querySelectorAll("#product-list .card");
    let visibleCards = [];

    cards.forEach(card => {
        const categoryMatch = currentFilterCat === "All" || card.dataset.category === currentFilterCat;
        const price = parseInt(card.querySelector("p").innerText.replace("₹", "").replace(/,/g, ""));
        const budgetMatch = currentBudgetMax === null || price <= currentBudgetMax;
        const searchTerm = document.getElementById("search-input").value.toLowerCase().trim();
        const name = card.querySelector("h3").innerText.toLowerCase();
        const category = (card.dataset.category || "").toLowerCase();
        const desc = (card.dataset.description || "").toLowerCase();
        const searchMatch = !searchTerm || name.includes(searchTerm) || category.includes(searchTerm) || desc.includes(searchTerm);

        if (categoryMatch && budgetMatch && searchMatch) {
            visibleCards.push({ card, price, rating: parseFloat(card.dataset.rating || "0") });
        }
    });

    // Apply sorting
    switch (currentSort) {
        case "price-low":
            visibleCards.sort((a, b) => a.price - b.price);
            break;
        case "price-high":
            visibleCards.sort((a, b) => b.price - a.price);
            break;
        case "rating":
            visibleCards.sort((a, b) => b.rating - a.rating);
            break;
        case "newest":
            visibleCards.sort((a, b) => parseInt(b.card.dataset.id) - parseInt(a.card.dataset.id));
            break;
        default:
            visibleCards.sort((a, b) => parseInt(a.card.dataset.id) - parseInt(b.card.dataset.id));
    }

    // Hide all cards first
    cards.forEach(card => card.style.display = "none");

    // Show sorted cards
    visibleCards.forEach(({ card }, index) => {
        card.style.display = "";
        card.style.order = index;
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = null;
    });

    document.getElementById("item-count").innerText = `Showing ${visibleCards.length} Gifts`;
    addWishlistButtonsToCards();
    updateWishlistButtons();
    showEmptyStateIfNeeded(visibleCards.length);
}

let currentFilterCat = "All";

function applyFilter(cat) {
    if (!requireLogin()) return;
    filterCat(cat);
}

function filterCat(cat) {
    currentFilterCat = cat;
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.remove("active");
        if (btn.getAttribute("onclick").includes(`'${cat}'`)) {
            btn.classList.add("active");
        }
    });
    renderFilteredProducts();
}

function searchProducts(query) {
    renderFilteredProducts();
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
    const card = document.querySelector(`#product-list .card[data-id="${id}"]`) || document.querySelector(`#wishlist-items .card[data-id="${id}"]`) || document.querySelector(`#ten-minute-product-list .card[data-id="${id}"]`);
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
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(20px)";
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

// Hide any existing toast on page load
function hideToastOnLoad() {
    const toast = document.querySelector(".toast");
    if (toast) {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(20px)";
    }
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
    updateOrderSummary(total);
}

function updateOrderSummary(subtotal) {
    let discount = 0;
    const discountEl = document.getElementById("summary-discount");
    const discountAmountEl = document.getElementById("discount-amount");
    const finalTotalEl = document.getElementById("final-total");
    const checkoutTotalEl = document.getElementById("checkout-total");

    if (appliedCoupon && COUPON_CODES[appliedCoupon]) {
        const coupon = COUPON_CODES[appliedCoupon];
        if (coupon.type === "percent") {
            discount = Math.round(subtotal * coupon.value / 100);
        } else if (coupon.type === "flat") {
            if (subtotal >= (coupon.minOrder || 0)) {
                discount = coupon.value;
            } else {
                // Coupon no longer valid for this subtotal
                appliedCoupon = null;
                document.getElementById("coupon-code").value = "";
            }
        }
    }

    const finalTotal = subtotal - discount;

    if (discount > 0) {
        if (discountEl) discountEl.classList.remove("hidden");
        if (discountAmountEl) discountAmountEl.innerText = "-₹" + discount.toLocaleString("en-IN");
        if (finalTotalEl) finalTotalEl.innerText = "₹" + finalTotal.toLocaleString("en-IN");
        const summaryFinal = document.getElementById("summary-final");
        if (summaryFinal) summaryFinal.classList.remove("hidden");
    } else {
        if (discountEl) discountEl.classList.add("hidden");
        const summaryFinal = document.getElementById("summary-final");
        if (summaryFinal) summaryFinal.classList.add("hidden");
    }

    if (checkoutTotalEl) checkoutTotalEl.innerText = "₹" + subtotal.toLocaleString("en-IN");
}

function applyCoupon() {
    const codeInput = document.getElementById("coupon-code");
    const messageEl = document.getElementById("coupon-message");
    const code = codeInput.value.trim().toUpperCase();

    if (!code) {
        showCouponMessage("Please enter a promo code", "error");
        return;
    }

    if (!COUPON_CODES[code]) {
        showCouponMessage("Invalid promo code", "error");
        return;
    }

    const coupon = COUPON_CODES[code];
    const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

    if (coupon.minOrder && subtotal < coupon.minOrder) {
        showCouponMessage(`Minimum order of ₹${coupon.minOrder} required for this code`, "error");
        return;
    }

    appliedCoupon = code;
    showCouponMessage(`Promo code applied: ${coupon.description}`, "success");
    updateOrderSummary(subtotal);
    codeInput.blur();
}

function showCouponMessage(message, type) {
    const messageEl = document.getElementById("coupon-message");
    messageEl.textContent = message;
    messageEl.className = "coupon-message " + type;
    messageEl.classList.remove("hidden");
    setTimeout(() => {
        messageEl.classList.add("hidden");
    }, 3000);
}

function autoFillCheckoutDetails() {
    const email = localStorage.getItem("giftStoreCurrentEmail") || (currentUser && currentUser.email) || "";
    const profile = email ? loadSavedProfile(email) : (currentUser || {});
    const nameEl = document.getElementById("checkout-name");
    const mobileEl = document.getElementById("checkout-mobile");
    const addressEl = document.getElementById("checkout-address");
    const locationEl = document.getElementById("checkout-location");
    const cityEl = document.getElementById("checkout-city");
    const stateEl = document.getElementById("checkout-state");
    const pincodeEl = document.getElementById("checkout-pincode");
    if (nameEl && profile.name) nameEl.value = profile.name;
    if (mobileEl && profile.phone) mobileEl.value = profile.phone;
    if (addressEl && profile.address) addressEl.value = profile.address;
    if (locationEl && profile.location) locationEl.value = profile.location;
    if (stateEl && profile.state) {
        stateEl.value = profile.state;
        populateCitiesForCheckout();
    }
    if (cityEl && profile.city) cityEl.value = profile.city;
    if (pincodeEl && profile.pincode) pincodeEl.value = profile.pincode;
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
    const giftWrap = document.getElementById("gift-wrap")?.checked || false;
    const giftMessage = document.getElementById("gift-message")?.checked || false;
    const giftMessageText = document.getElementById("gift-message-text")?.value.trim() || "";
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

    const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    let discount = 0;
    let couponCode = null;
    let couponDescription = "";
    if (appliedCoupon && COUPON_CODES[appliedCoupon]) {
        const coupon = COUPON_CODES[appliedCoupon];
        if (coupon.type === "percent") {
            discount = Math.round(subtotal * coupon.value / 100);
        } else if (coupon.type === "flat") {
            if (subtotal >= (coupon.minOrder || 0)) {
                discount = coupon.value;
            }
        }
        couponCode = appliedCoupon;
        couponDescription = coupon.description;
    }
    const total = subtotal - discount;

    const order = {
        order_number: "GA" + Date.now().toString().slice(-8),
        date: new Date().toISOString(),
        items: cart.map(item => ({ ...item })),
        subtotal: subtotal,
        discount: discount,
        couponCode: couponCode,
        couponDescription: couponDescription,
        total: total,
        payment: payment,
        paymentDetail: paymentDetail,
        giftWrap: giftWrap,
        giftMessage: giftMessage,
        giftMessageText: giftMessageText,
        name, mobile, address, location, city, state, pincode
    };
    saveOrderToStorage(order);

    let toastMsg = `Order Placed Successfully! Total: ₹${total.toLocaleString("en-IN")} via ${paymentDetail}`;
    if (discount > 0) {
        toastMsg += ` (₹${discount.toLocaleString("en-IN")} off with ${couponCode})`;
    }
    showToast(toastMsg);
    cart = [];
    saveCart(cart);
    appliedCoupon = null;
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

function reorderItems(itemsJson) {
    if (!requireLogin()) return;
    try {
        const items = JSON.parse(itemsJson);
        cart = items.map(item => ({ ...item, quantity: item.quantity || 1 }));
        saveCart(cart);
        updateCartCount();
        showToast("Items added to cart for reorder");
        showPage("cart");
    } catch (e) {
        showToast("Error adding items to cart");
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

        const giftOptionsHtml = (order.giftWrap || order.giftMessage) ? `
            <div class="gift-options-display">
                <h4>Gift Options</h4>
                <ul>
                    ${order.giftWrap ? '<li><i class="fa-solid fa-gift"></i> Gift Wrap (Free)</li>' : ''}
                    ${order.giftMessage ? `<li><i class="fa-solid fa-envelope"></i> Gift Message: "${order.giftMessageText}"</li>` : ''}
                </ul>
            </div>
        ` : '';

        const couponHtml = (order.discount && order.discount > 0) ? `
            <div class="coupon-display">
                <h4>Discount Applied</h4>
                <p>Promo Code: <strong>${order.couponCode}</strong> - ${order.couponDescription}</p>
                <p>Subtotal: ₹${order.subtotal.toLocaleString("en-IN")} | Discount: -₹${order.discount.toLocaleString("en-IN")} | Total: ₹${order.total.toLocaleString("en-IN")}</p>
            </div>
        ` : '';

        const statusLabel = tracking.status.charAt(0).toUpperCase() + tracking.status.slice(1);
        const statusClass = tracking.status === "delivered" ? "status-delivered" :
            tracking.status === "out" ? "status-out" :
                tracking.status === "shipped" ? "status-shipped" :
                    tracking.status === "confirmed" ? "status-confirmed" : "status-placed";

        container.innerHTML += `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-id">Order #${order.order_number}</div>
                        <div class="order-date">${new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
                    </div>
                    <div class="order-total">₹${order.total.toLocaleString("en-IN")}</div>
                </div>
                <div class="order-meta">
                    <span class="order-status ${statusClass}">${statusLabel}</span>
                    <span class="order-payment">${order.paymentDetail}</span>
                </div>
                <div class="order-items">
                    ${itemsHtml}
                </div>
                ${giftOptionsHtml}
                ${couponHtml}
                <div class="tracking-section">
                    <div class="tracking-title">Track Order</div>
                    <div class="tracking-timeline">
                        ${timelineHtml}
                    </div>
                    <div class="delivery-estimate">
                        🚚 Your Order will be delivered at: <strong>${estimatedDelivery}</strong>
                    </div>
                </div>
                <div class="order-actions">
                    <button class="order-cancel-btn" onclick="cancelOrder(${orders.indexOf(order)})" ${tracking.status === "delivered" ? "disabled style='opacity:0.5;cursor:not-allowed;'" : ""}>Cancel Order</button>
                    <button class="order-reorder-btn" onclick="reorderItems(${JSON.stringify(order.items).replace(/"/g, '"')})">Reorder</button>
                </div>
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
    const giftWrap = document.getElementById("gift-wrap")?.checked || false;
    const giftMessage = document.getElementById("gift-message")?.checked || false;
    const giftMessageText = document.getElementById("gift-message-text")?.value || "";
    localStorage.setItem("giftStorePaymentDetails", JSON.stringify({ upiId, upiName, upiMobile, cardNumber, cardName, cardExpiry, upiBank, cardBank, giftWrap, giftMessage, giftMessageText }));
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
        const giftWrapEl = document.getElementById("gift-wrap");
        const giftMessageEl = document.getElementById("gift-message");
        const giftMessageTextEl = document.getElementById("gift-message-text");
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
        if (giftWrapEl && data.giftWrap) {
            giftWrapEl.checked = true;
        }
        if (giftMessageEl && data.giftMessage) {
            giftMessageEl.checked = true;
            if (giftMessageTextEl) giftMessageTextEl.classList.remove("hidden");
        }
        if (giftMessageTextEl && data.giftMessageText) {
            giftMessageTextEl.value = data.giftMessageText;
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

    // Gift options listeners
    const giftWrap = document.getElementById("gift-wrap");
    const giftMessage = document.getElementById("gift-message");
    const giftMessageText = document.getElementById("gift-message-text");

    if (giftWrap) {
        giftWrap.addEventListener("change", function () {
            savePaymentDetails();
        });
    }
    if (giftMessage) {
        giftMessage.addEventListener("change", function () {
            if (giftMessageText) {
                giftMessageText.classList.toggle("hidden", !this.checked);
            }
            savePaymentDetails();
        });
    }
    if (giftMessageText) {
        giftMessageText.addEventListener("input", savePaymentDetails);
    }
}

attachCardClicks();
updateCartCount();
initPaymentListeners();
addPlaceOrderButtons();

const deliveryProducts = [
    { id: 1, name: "Birthday Cake", price: 599, category: "Birthday", img: "images/cake.jpg", rating: "4.7", description: "Soft, freshly baked eggless birthday cake with creamy vanilla frosting and cheerful sprinkles.", features: ["Eggless & freshly baked", "Serves 4-6 people", "Same-day delivery available", "100% vegetarian"], type: "eatable" },
    { id: 5, name: "Chocolate Box", price: 399, category: "Birthday", img: "images/Chocolate box.jpg", rating: "4.7", description: "A luxurious box of assorted Belgian chocolates with ganache fillings.", features: ["Assorted flavours", "Premium gift packaging", "Shelf life 6 months", "Hand-crafted Belgian chocolates"], type: "eatable" },
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
let currentDeliverySort = "default";
let currentDeliveryBudgetMax = null;

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
    if (currentDeliveryBudgetMax !== null) {
        filtered = filtered.filter(p => p.price <= currentDeliveryBudgetMax);
    }
    // Apply sorting
    switch (currentDeliverySort) {
        case "price-low":
            filtered.sort((a, b) => a.price - b.price);
            break;
        case "price-high":
            filtered.sort((a, b) => b.price - a.price);
            break;
        case "rating":
            filtered.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
            break;
        case "newest":
            filtered.sort((a, b) => b.id - a.id);
            break;
        default:
            filtered.sort((a, b) => a.id - b.id);
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
            <button class="wishlist-btn" onclick="event.stopPropagation();toggleWishlist(${product.id})" aria-label="Add to wishlist">
                <i class="fa-regular fa-heart"></i>
            </button>
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
    updateWishlistButtons();
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

function applyDeliverySort(sortValue) {
    currentDeliverySort = sortValue;
    renderDeliveryProducts();
}

function applyDeliveryBudgetFilter(maxPrice) {
    currentDeliveryBudgetMax = maxPrice;
    document.querySelectorAll("#ten-minute-budget-pills .budget-pill").forEach(pill => {
        pill.classList.remove("active");
        if ((maxPrice === null && pill.dataset.max === "") || (maxPrice !== null && parseInt(pill.dataset.max) === maxPrice)) {
            pill.classList.add("active");
        }
    });
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
        wishlist = loadWishlist();
    }
    updateProfileMenu();
    renderProfile();
    updateWishlistCount();
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
    addWishlistButtonsToCards();
    hideToastOnLoad();
}

initApp();

const interactiveElements = document.querySelectorAll("a, button, .card, .header-nav-item, .header-profile, .header-mobile-toggle, .filter-btn, .delivery-cat-btn, .quick-delivery-btn, input, textarea, select, .payment-option, .payment-detail-option, .location-btn, .profile-dropdown-item, .auth-modal-close, .order-btn, .order-cancel-btn, .checkout-actions .back-btn, .profile-save-btn, .profile-delete-btn, .card button, .remove-btn, .place-order-btn");