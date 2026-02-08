import csv

csv_file = 'Seoul_Trip_Locations_v2.csv'
html_file = 'Naver_Map_Desktop_v3.html'

html_content = """
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>首爾之旅 Naver Map 連結 (v3 - Verified Korean Names)</title>
    <style>
        body { font-family: "Microsoft JhengHei", Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background-color: #f2f2f2; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        a { text-decoration: none; color: #007bff; font-weight: bold; }
        a:hover { text-decoration: underline; }
        .korean-name { color: #28a745; font-weight: bold; }
        .address { font-size: 0.9em; color: #555; }
    </style>
</head>
<body>
    <h1>首爾之旅 Naver Map 連結 (v3 - Verified Korean Names)</h1>
    <p>點擊「韓文名稱」即可直接在 Naver Map 搜尋。地址已更新為韓文道路名地址，方便導航。</p>
    <table>
        <thead>
            <tr>
                <th>店家名稱 (中文/英文)</th>
                <th>韓文名稱 (點擊搜尋)</th>
                <th>分類</th>
                <th>備註</th>
                <th>營業時間</th>
                <th>地址 (韓文)</th>
            </tr>
        </thead>
        <tbody>
"""

with open(csv_file, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    next(reader) # Skip header
    for row in reader:
        if not row: continue
        # Row format: Name, Category, Note, Hours, Address
        # Name in v2 is: "Korean Name (Chinese/English)" or "Chinese (Korean)"?
        # In v2 I wrote: "청와옥 을지로3가직영점 (Cheongwaok)"
        # I should split this if possible, or just display it.
        # Actually, let's just display the full string as "Name".
        # But for the SEARCH LINK, I need the KOREAN part.
        
        full_name = row[0]
        category = row[1]
        note = row[2]
        hours = row[3]
        address = row[4]
        
        # Extract Korean part for search. 
        # My format in v2: "Korean Name (English/Chinese)"
        # I'll split by "(" and take the first part.
        search_query = full_name.split('(')[0].strip()
        
        # Display name: The part inside brackets if exists, else full name?
        # Actually, let's show the full name in the "Name" column, but maybe bold the English/Chinese part?
        # Let's just put `full_name` in the first column.
        # Wait, the user wants "Korean store name" to be the link.
        # In v2 CSV, column 0 is "Name".
        
        # I'll construct the link using `search_query`.
        naver_link = f"https://map.naver.com/v5/search/{search_query}"
        
        html_content += f"""
            <tr>
                <td>{full_name}</td>
                <td><a href="{naver_link}" target="_blank" class="korean-name">{search_query}</a></td>
                <td>{category}</td>
                <td>{note}</td>
                <td>{hours}</td>
                <td class="address">{address}</td>
            </tr>
        """

html_content += """
        </tbody>
    </table>
</body>
</html>
"""

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(html_content)

print(f"Generated {html_file}")
