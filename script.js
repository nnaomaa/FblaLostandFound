let lostItems = [];

// loads the items from localStorage on when the page loads
if(localStorage.getItem("lostItems")) {
    lostItems = JSON.parse(localStorage.getItem("lostItems"));
}



function showPage(pageId) {
    document.getElementById('home')
    .style.display = 'none';
    document.getElementById('browse')
    .style.display = 'none';
    document.getElementById('report')
    .style.display = 'none';
    document.getElementById('claim')
    .style.display = 'none';
    document.getElementById('admin')
    .style.display = 'none';
    
    switch(pageId) {
        case 'home': 
            document.getElementById('home').style.display = 'block'; 
            break;
        case 'browse': 
            document.getElementById('browse').style.display = 'block'; 
            displayItems(); 
            
            break;
        case 'report': 
            document.getElementById('report').style.display = 'block'; 
            
            break;
        case 'claim': 
            document.getElementById('claim').style.display = 'block'; 
            break;
        case 'admin':
            document.getElementById('admin').style.display = 'block'; 
            break;
    }
}

function toggleMenu() {
        document.getElementById("navLinks").classList.toggle("show");
}


// report found section
function reportItem(){
    // gets the form values
    let itemName = document.getElementById("nameInput").value;
    let itemDesc = document.getElementById("descInput").value;
 
    
    if(!itemName || itemName == "" || !itemDesc || itemDesc == ""){
        alert("Please fill in all inputs fields!")
        return;
    }
    
    // make new item obj
    let newItem = {
        id: lostItems.length+1,
        itemName,
        itemDesc,
        image: "",
        status: "pending"
    }
    
    // push the new item to lostItems array
    lostItems.push(newItem)
    showImage();

    
   
    
    // save new array to localStorage
    localStorage.setItem("lostItems", JSON.stringify(lostItems))
    
    // clear form
    document.getElementById("nameInput").value = "";
    document.getElementById("descInput").value = "";
    
    alert("Item reported successfully!")
    showPage('browse');
    
}


function showImage() {
    const input = document.getElementById("imageInput");
    const preview = document.getElementById("preview");

    if (!input.files || !input.files[0]) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = "block";
    };
    reader.readAsDataURL(input.files[0]);
}

function displayItems(searchTerm = "") {
    // filters
    let itemsToShow = lostItems;
    
    if(searchTerm) {
        itemsToShow = lostItems.filter(item => 
            item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toString().includes(searchTerm)
        );
    }
    
    
    const container = document.querySelector('.lost-items-grid');
    
    // clears whats inside
    container.innerHTML = "";
    
    // checks if there are any items
    if (itemsToShow.length === 0) {
    container.innerHTML = `
        <div class="no-results">
            <p>No items found.</p>
        </div>
    `;
    return;
}
    
    // displays items.
    itemsToShow.forEach(item => {
        const itemCard = `
            <div class="lost-item" data-id="${item.id}">
                <img src="${item.image || 'https'}"alt="${item.itemName}">
                <div class="item-info">
                    <h4>${item.itemName}</h4>
                    <p>${item.itemDesc}</p>
                    <span class="item-id">ID: ${item.id}</span>
                    <span class="item-status" style="display: block; margin-top: 8px; color: ${item.status === 'approved' ? 'green' : item.status === 'claimed' ? 'blue' : 'orange'};">
                        Status: ${item.status || 'ending'}
                    </span>
                    <button class="claim-btn" onclick="claimItemById(${item.id})">Claim</button>
                </div>
            </div>
        `;
        container.innerHTML += itemCard;
    });
}

// search bar

document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.getElementById('searchBox');
    
    if(searchBox) {
        searchBox.addEventListener('input', function(e) {
            displayItems(e.target.value);
        });
    }
    
    // shows the home page
    showPage('home');
});

// claim item

function claimItemById(itemId) {
    showPage('claim');
    document.getElementById('idInput').value = itemId;
}

// claim
document.addEventListener('DOMContentLoaded', function() {
    const claimForm = document.getElementById('claimForm');
    
    if(claimForm) {
        claimForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('claimEmail').value;
            const itemId = document.getElementById('idInput').value;
            
            if(!email || !itemId) {
                alert("Please fill in all fields.");
                return;
            }
            
            // finds the items
            const itemIndex = lostItems.findIndex(item => item.id.toString() === itemId);
            
            if(itemIndex === -1) {
                alert("Item ID not found.");
                return;
            }
            
            // updates it to claimed
            lostItems[itemIndex].status = "claimed";
            lostItems[itemIndex].claimedBy = email;
            
            // saves to the local storage
            localStorage.setItem("lostItems", JSON.stringify(lostItems));
            
            alert(`Claim submitted for Item ID: ${itemId}. You will receive an email at ${email} when approved.`);
            
            // clears the form
            claimForm.reset();
            
            // sets back to the browse page
            showPage('browse');
        });
    }
});

function adminSignup() {
    const user = document.getElementById("newAdminUser").value;
    const pass = document.getElementById("newAdminPass").value;

    if (!user || !pass) {
        alert("Fill all fields");
        return;
    }

    localStorage.setItem("adminAccount", JSON.stringify({ user, pass }));
    alert("Admin account created!");
}

function adminSignup() {
    const user = document.getElementById("newAdminUser").value.trim();
    const pass = document.getElementById("newAdminPass").value.trim();

    if (!user || !pass) {
        alert("Fill all fields");
        return;
    }

    const existing = JSON.parse(localStorage.getItem("adminAccount"));

    if (existing && existing.user === user) {
        alert("Username already taken");
        return;
    }

    localStorage.setItem("adminAccount", JSON.stringify({ user, pass }));
    alert("Admin account created!");
}

function adminLogin() {
    const user = document.getElementById("adminUser").value;
    const pass = document.getElementById("adminPass").value;

    const stored = JSON.parse(localStorage.getItem("adminAccount"));

    if (!stored || user !== stored.user || pass !== stored.pass) {
        alert("Invalid login");
        return;
    }

    alert("Welcome Admin!");

    // Go to admin page
    showPage('admin');

    // Replace admin page content with dashboard
    loadAdminDashboard();
}

const STAFF_CODE = "WESTMEC2025"; // example

function adminSignup() {
    const user = document.getElementById("newAdminUser").value.trim();
    const pass = document.getElementById("newAdminPass").value.trim();
    const code = document.getElementById("adminCode").value.trim();

    if (!user || !pass || !code) {
        alert("Fill all fields");
        return;
    }

    if (code !== STAFF_CODE) {
        alert("Invalid staff access code");
        return;
    }

    const existing = JSON.parse(localStorage.getItem("adminAccount"));

    if (existing && existing.user === user) {
        alert("Username already taken");
        return;
    }

    localStorage.setItem("adminAccount", JSON.stringify({ user, pass }));
    alert("Admin account created!");
}


function loadAdminDashboard() {
    const stats = getAdminStats();
    const adminPage = document.getElementById("admin");

    adminPage.innerHTML = `
        <h2 class="section-title">Admin Dashboard</h2>

        <div class="admin-stats">
            <div class="stat-box">Pending<br><strong>${stats.pending}</strong></div>
            <div class="stat-box">Reviewing<br><strong>${stats.reviewing}</strong></div>
            <div class="stat-box">Claimed<br><strong>${stats.claimed}</strong></div>
        </div>

        <h3 style="margin-top:30px;">Item Management</h3>
        <div id="adminItemList"></div>

        <button class="btn-2 btn-width" style="margin-top:30px;" onclick="adminLogout()">
            Logout
        </button>
    `;

    displayAdminItems();
}

function adminLogout() {
    showPage('admin');
    location.reload(); // simple & safe reset
}



// Create button container
btnContainer.style.marginTop = '12px';

// Approve / Accept button
const approveBtn = document.createElement('button');
approveBtn.textContent = 'Accept Claim';
approveBtn.className = 'btn-1';
approveBtn.style.marginRight = '10px';
approveBtn.onclick = function () {
    approveItem(item.id);
};

// Reject button (ONLY show if reviewing)
const rejectBtn = document.createElement('button');
rejectBtn.textContent = 'Reject Claim';
rejectBtn.className = 'btn-2';
rejectBtn.style.background = '#6b7280';
rejectBtn.onclick = function () {
    rejectItem(item.id);
};

btnContainer.appendChild(approveBtn);

// Only show reject if claim exists
if (item.status === "reviewing") {
    btnContainer.appendChild(rejectBtn);
}

function approveItem(id) {
    lostItems = lostItems.map(item =>
        item.id === id
            ? { ...item, status: "claimed" }
            : item
    );

    localStorage.setItem("lostItems", JSON.stringify(lostItems));

    alert("Claim accepted. Item marked as claimed.");
    displayAdminItems();
    displayItems();
}

function rejectItem(id) {
    if (!confirm("Reject?")) return;

    lostItems = lostItems.map(item =>
        item.id === id
            ? {
                ...item,
                status: "approved",
            }
            : item
    );

    localStorage.setItem("lostItems", JSON.stringify(lostItems));

    alert("Claim rejected.");
    displayAdminItems();
    displayItems();
    lostItems[itemIndex].status = "reviewing";
}


function getAdminStats() {
    return {
        pending: lostItems.filter(i => i.status === "pending").length,
        reviewing: lostItems.filter(i => i.status === "reviewing").length,
        claimed: lostItems.filter(i => i.status === "claimed").length
    };
}































































































































































































/* // ========================================
// ADMIN FUNCTIONS (UPDATE & DELETE)
// ========================================

function displayAdminItems() {
    const adminContainer = document.getElementById('adminItemList');
    
    if(!adminContainer) return;
    
    adminContainer.innerHTML = "";
    
    if(lostItems.length === 0) {
        adminContainer.innerHTML = "<p>No items to manage.</p>";
        return;
    }
    
    // Display each item using forEach
    lostItems.forEach(item => {
        const itemRow = `
            <div class="admin-item-row" style="border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 5px;">
                <h4>${item.itemName} (ID: ${item.id})</h4>
                <p>${item.itemDesc}</p>
                <p><strong>Status:</strong> ${item.status}</p>
                ${item.claimedBy ? `<p><strong>Claimed by:</strong> ${item.claimedBy}</p>` : ''}
                <div style="margin-top: 10px;">
                    <button onclick="approveItem(${item.id})" class="btn-1" style="margin-right: 10px;">Approve</button>
                    <button onclick="deleteItem(${item.id})" class="btn-2" style="background: #d9534f;">Delete</button>
                </div>
            </div>
        `;
        adminContainer.innerHTML += itemRow;
    });
}

// Approve an item (UPDATE) - using map()
function approveItem(id) {
    // Use map to update the specific item
    lostItems = lostItems.map(item => 
        item.id === id ? { ...item, status: "approved" } : item
    );
    
    // Save to localStorage
    localStorage.setItem("lostItems", JSON.stringify(lostItems));
    
    alert("Item approved!");
    displayAdminItems();
}

// Delete an item (DELETE) - using filter()
function deleteItem(id) {
    if(!confirm("Are you sure you want to delete this item?")) {
        return;
    }
    
    // Use filter to remove the item
    lostItems = lostItems.filter(item => item.id !== id);
    
    // Save to localStorage
    localStorage.setItem("lostItems", JSON.stringify(lostItems));
    
    alert("Item deleted!");
    displayAdminItems();
    displayItems(); // Refresh browse page if open
}


function adminLogin() {
    const username = document.getElementById("userInput").value;
    const password = document.getElementById("passInput").value;
    
    // Simple hardcoded login (in production, use proper authentication)
    if(username === "admin" && password === "password") {
        document.getElementById('adminLogin').style.display = 'none';

        // Create admin dashboard
        const adminPage = document.getElementById('admin');
        adminPage.innerHTML = `
            
        `;
        
        displayAdminItems();
    } else {
        alert("Invalid credentials!");
    }
}

// Add login button handler
document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.querySelector('#adminLogin button');
    if(loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            adminLogin();
        });
    }
});

// ========================================
// INITIALIZE ON PAGE LOAD
// ========================================

window.onload = function() {
    showPage('home');
    console.log("Lost and Found system loaded!");
    console.log("Current items:", getItems());
}; */



