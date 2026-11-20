import re

with open('Project.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to find each card and add wishlist button
card_pattern = r'(<div class="card" data-category="[^"]*" data-id="(\d+)"[^>]*>.*?<img src="images/[^"]*" alt="[^"]*"\s+onerror="this\.onerror=null;this\.src=FALLBACK_IMG">\s+)(<h3>)'

def replace_card(match):
    before = match.group(1)
    data_id = match.group(2)
    h3 = match.group(3)
    wishlist_btn = f'                            <button class="wishlist-btn" onclick="event.stopPropagation();toggleWishlist({data_id})" aria-label="Add to wishlist">\n                                <i class="fa-regular fa-heart"></i>\n                            </button>\n'
    return before + wishlist_btn + h3

new_content = re.sub(card_pattern, replace_card, content, flags=re.DOTALL)

with open('Project.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Done - Wishlist buttons added to all cards')