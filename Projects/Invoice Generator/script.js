let isDark = localStorage.getItem('invDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    document.body.classList.toggle('dark');
    localStorage.setItem('invDark', !isDark);
    isDark = !isDark;
}

function addItem() {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" class="desc" placeholder="Item" oninput="updateTotal()"></td>
        <td><input type="number" class="qty" value="1" oninput="updateTotal()"></td>
        <td><input type="number" class="price" value="0" oninput="updateTotal()"></td>
        <td class="row-total">$0.00</td>
    `;
    document.getElementById('items').appendChild(row);
}

function updateTotal() {
    let sub = 0;
    document.querySelectorAll('#items tr').forEach(row => {
        const q = parseFloat(row.querySelector('.qty').value) || 0;
        const p = parseFloat(row.querySelector('.price').value) || 0;
        const t = q * p;
        sub += t;
        row.querySelector('.row-total').innerText = `$${t.toFixed(2)}`;
    });
    
    const tax = sub * 0.10;
    const total = sub + tax;
    
    document.getElementById('subtotal').innerText = sub.toFixed(2);
    document.getElementById('tax').innerText = tax.toFixed(2);
    document.getElementById('total').innerText = total.toFixed(2);
}

updateTotal();