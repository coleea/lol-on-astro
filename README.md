# ๐ ๋กค ์ ์ ๊ฒ์ astro๋ฒ์  ๐

## ์ค๋ช
- create-react-app๊ธฐ๋ฐ์ ์ฑ์ astro๋ฒ์ ์ผ๋ก ๋ฆฌํฉํ ๋งํ ๋กค ์ ์ ๊ฒ์ ์ฑ์๋๋ค
- Astro๋ partial hydration ๊ธฐ๋ฅ์ ์ง์ํ๋ SSG ํ๋ ์์ํฌ ์๋๋ค

## ์คํ๋ฐฉ๋ฒ 
๋ณธ ๋ฆฌํฌ์งํ ๋ฆฌ๋ฅผ git clone์ผ๋ก ๋ค์ด๋ฐ์ ํ `npm i && npm run dev`๋ฅผ ์๋ ฅํฉ๋๋ค\
\
๋๋ `pnpm i && pnpm dev`๋ฅผ ์๋ ฅํฉ๋๋ค\
\
node.js ๋ฒ์  17.4.0์ด ํ์ํฉ๋๋ค

## ์น์์ ์คํํ๊ธฐ
- ํด๋ผ์ฐ๋ํ๋ ์ด ๋ฒ์ ์ `https://lol-on-astro.devkr.info` ์์ ์ด์ฉ์ด ๊ฐ๋ฅํฉ๋๋ค
- `https://lol-on-astro.devkr.info/?user={username}` ํํ๋ก ์ ์ ๋ค์์ ์ง์  ๊ฒ์ํ  ์ ์์ต๋๋ค
- fastly ๋ฒ์ ์ `http://lol-on-fastly.devkr.info/` ์์ ์ด์ฉ์ด ๊ฐ๋ฅํฉ๋๋ค
- `https://lol-on-fastly.devkr.info/?user={username}` ํํ๋ก ์ ์ ๋ค์์ ์ง์  ๊ฒ์ํ  ์ ์์ต๋๋ค


## ํผํฌ๋จผ์ค ๋น๊ต (CDN ์บ์ฌํํธ ๊ธฐ์ค. i7-2600 @ ํฌ๋กฌ 97.0.4692.99์์ ์ํ๋์์ต๋๋ค)

<table>
    <tr>
        <td>์งํ</td>
        <td>์ด์  (create-react-app @ netlify)</td>
        <td>์ดํ (astro @ cloudflare pages)</td>
        <td>์ดํ (astro @ fastly)</td>
    </tr>
    <tr>
        <td>TTFB</td>
        <td>84.4 ~ 487.4 ms</td>
        <td>13.9 ~ 22.5ms</td>
        <td><b style="color:red"> 3.2 ~ 3.5 ms</b></td>
    </tr>
    <tr>
        <td><del>DOMContentLoaded ์ด๋ฒคํธ ํธ๋ฆฌ๊ฑฐ</del></td>
        <td><del>1004 ~ 2120 ms</del></td>
        <td><del>304 ~ 354 ms</del></td>
        <td><del>227ms ~ 271 ms</del></td>
    </tr>    
    <tr>
        <td><del>Load ์ด๋ฒคํธ ํธ๋ฆฌ๊ฑฐ</del></td>
        <td><del>1710 ~ 2910 ms</del></td>
        <td><del>357 ~ 414 ms</del></td>
        <td><del>271 ~ 317 ms</del></td>
    </tr>        
</table>

## ํผํฌ๋จผ์ค ๋น๊ต (webpagetest.org ์ ๊ณต)
๋ฏธ๊ตญ ๋ฒ์ง๋์ ์ฃผ์์ ๋ฐ์คํฌํฑ ํฌ๋กฌ์ผ๋ก ์ค์ํ ๋ฒค์น๋งํฌ์๋๋ค

์ด์  (create-react-app @ netlify)
![](./githubFile/bench_cra.png)
์์ธ๋ [์ฌ๊ธฐ์](https://www.webpagetest.org/result/220203_BiDcJS_ff9882f16abeeaa1bbf559c3643e3e73/) ํ์ธํ  ์ ์์ต๋๋ค

์ดํ (astro @ fastly)
![](./githubFile/bench_fastly.png)
์์ธ๋ [์ฌ๊ธฐ์](https://www.webpagetest.org/result/220203_BiDcKZ_a8ace8a73f75b9d23c0ae63cf51c2285/) ํ์ธํ  ์ ์์ต๋๋ค


## ๋ผ์ดํธํ์ฐ์ค ์ค์ฝ์ด  (m1 ๋งฅ๋ฏธ๋์์ ์ํ๋์์ต๋๋ค)

์ ) create-react-app @ netlify ๋ฒ์ 

![๋ผ์ดํธํ์ฐ์ค ์ ](./githubFile/lighthouse_before.png)



ํ) astro @ cloudflare pages ๋ฒ์ 

![๋ผ์ดํธํ์ฐ์ค ํ](./githubFile/lighthouse_after.png)

astro๋ก ๋ณ๊ฒฝํ ์ดํ Largest Contentful Paint์ ์๋ชจ์๊ฐ์ด ์ฝ 300ms ๋จ์ถ๋์์ต๋๋ค.\
TTI๋ ์ฝ 400ms ๋จ์ถ๋์์ต๋๋ค\
Cumulative Layout Shift๋ ์ง์  ์ต์ ํ ํ์์ต๋๋ค

<del>
## ํด๋ผ์ฐ๋ํ๋ ์ด ๋ฒ์ ์ http3๋ก ์ ์ํ๊ธฐ

ํด๋ผ์ฐ๋ํ๋ ์ด๋ http3๋ฅผ ์ง์ํฉ๋๋ค. ์ปค๋ฅ์์ด http3๊ธฐ๋ฐ์ผ๋ก ์ด๋ฃจ์ด์ง๋์ง ํ์ธํ๊ธฐ ์ํด์ ์๋์ ์ ์ฐจ๋ฅผ ์งํํฉ๋๋ค\
๋จผ์  `https://lol-on-astro.devkr.info/cdn-cgi/trace`์ ์ ์ํฉ๋๋ค. ๊ทธ๋ฌ๋ฉด ์๋์ ๊ฐ์ ํ์คํธ๊ฐ ํ์๋ฉ๋๋ค
```
fl=34f140
h=lol-on-astro.devkr.info
ip=121.172.71.142
ts=1643853395.88
visit_scheme=https
uag=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.81 Safari/537.36
colo=ICN
http=http/2
loc=KR
tls=TLSv1.3
sni=plaintext
warp=off
gateway=off
```
์์ ํ์คํธ์์ `http=`๋ผ๋ ํญ๋ชฉ์ `http/2`๋ผ๊ณ  ํ๊ธฐ๋์ด ์์ต๋๋ค. ์ด๋ ์น๋ธ๋ผ์ฐ์ ๊ฐ http3๋ฅผ ์ง์ํ์ง ์๊ธฐ ๋๋ฌธ์๋๋ค. http3๊ธฐ๋ฅ ํ์ฑํ๋ฅผ ์ํ๋ค๋ฉด ์๋์ ์ ์ฐจ๋ฅผ ์งํํฉ๋๋ค
1. ํฌ๋ก๋ฏธ์ ๊ณ์ด์ ๋ธ๋ผ์ฐ์ ์์ `chrome://flags`๋ฅผ ์๋ ฅํฉ๋๋ค
1. `Search flags` ๊ฒ์์ฐฝ์์ `Experimental QUIC protocol`์ ์๋ ฅํฉ๋๋ค
1. `Experimental QUIC protocol` ํญ๋ชฉ์ `Enabled`๋ก ๋ณ๊ฒฝํ๊ณ  ์น๋ธ๋ผ์ฐ์ ๋ฅผ ์ฌ์์ํฉ๋๋ค
</del>

## ์คํ

- Astro
- react
- SASS Module
- Cloudflare Pages & fastly
 
<img src="./githubFile/astro_logo_big.png" height="200px" />
<img src="./githubFile/react_logo.jpeg" height="200px" />
<br/>
<img src="./githubFile/sass_logo.svg" height="200px" />
<img src="./githubFile/cf_pages_logo.png" height="200px" />
<img src="./githubFile/fastly-logo.png" height="200px" />


## further study
- remix ๋ฒ์ ์ผ๋ก ๋ฆฌํฉํ ๋งํ์ฌ ํผํฌ๋จผ์ค๋ฅผ ๋น๊ตํฉ๋๋ค