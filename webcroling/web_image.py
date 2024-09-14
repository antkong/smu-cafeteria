import requests
from bs4 import BeautifulSoup
import os
import time

# 새로운 게시물을 확인하는 함수
def check_new_posts():
    url = "https://www.smu.ac.kr/kor/life/restaurantView3.do"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    # 최근 게시물 ID 저장
    with open('latest_post_id.txt', 'r') as file:
        latest_post_id = file.read().strip()

    # 게시물 ID 추출
    new_posts = []
    for post in soup.select('div.board_list li'):
        post_id = post.find('a')['href'].split('=')[-1]
        if post_id > latest_post_id:
            new_posts.append(post_id)

    # 최신 게시물 ID 갱신
    if new_posts:
        with open('latest_post_id.txt', 'w') as file:
            file.write(new_posts[0])

    return new_posts

# 이미지 다운로드 및 HTML 파일 생성 함수
def download_images(post_ids):
    base_url = "https://www.smu.ac.kr/kor/life/restaurantView3.do"
    image_urls = []
    for post_id in post_ids:
        response = requests.get(f"{base_url}?post_id={post_id}")
        soup = BeautifulSoup(response.text, 'html.parser')
        images = soup.find_all('img')
        for img in images:
            img_url = img['src']
            if not img_url.startswith('http'):
                img_url = base_url + img_url
            img_data = requests.get(img_url).content
            img_name = os.path.join('images', os.path.basename(img_url))
            with open(img_name, 'wb') as handler:
                handler.write(img_data)
            image_urls.append(img_name)

    # HTML 파일 생성
    html_content = "<html><body>\n"
    for img_url in image_urls:
        html_content += f'<img src="{img_url}" />\n'
    html_content += "</body></html>"

    with open('output.html', 'w') as f:
        f.write(html_content)

    print("HTML 파일이 생성되었습니다.")

# 주기적으로 실행
while True:
    new_posts = check_new_posts()
    if new_posts:
        download_images(new_posts)
    # 1시간마다 실행 (3600초)
    time.sleep(5)
    print("갱신 중")
