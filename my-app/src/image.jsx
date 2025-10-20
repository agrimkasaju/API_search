function Profile1() {
    return (
        <img src="https://i.ebayimg.com/images/g/sJkAAOSwhSNf8RDh/s-l1200.jpg"
            alt="Expensive Apple from ebay" style={{ width: 300, height: 300 }}
        />
    );
}

function Profile2() {
    return (
        <img src="https://ae01.alicdn.com/kf/S982b38ef2dca4556ad909d17ed380cb3k.jpg"
            alt="Expensive Apple from aliexpress" style={{ width: 300, height: 300 }}
        />
    );
}

export default function Image() {
    return (
        <section>
            <h1>Expensive Apples</h1>
            <Profile1 />;
            <p>Expensive Apple from ebay</p>
            <Profile2 />;
            <p>Expensive Apple from aliexpress</p>
        </section>
    );
}