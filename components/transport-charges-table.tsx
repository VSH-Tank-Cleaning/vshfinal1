export function TransportChargesTable() {
  return (
    <div className="price-table-wrap">
      <table className="price-table price-table-transport">
        <caption className="sr-only">Transport charge by road distance</caption>
        <thead>
          <tr>
            <th scope="col">Road distance</th>
            <th scope="col">Transport charge</th>
          </tr>
        </thead>
        <tbody>
          <tr><th scope="row">Up to 10 km</th><td><strong>Free</strong></td></tr>
          <tr><th scope="row">Above 10 km up to 15 km</th><td><strong>₹50</strong></td></tr>
          <tr><th scope="row">Above 15 km up to 20 km</th><td><strong>₹75</strong></td></tr>
          <tr><th scope="row">Above 20 km</th><td><strong>₹100</strong></td></tr>
        </tbody>
      </table>
    </div>
  )
}
