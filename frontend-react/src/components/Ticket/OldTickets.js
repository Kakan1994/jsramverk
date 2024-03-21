function OldTickets({oldTickets}) {
    if (!oldTickets) return "Loading tickets...";

    return (
        <div>
            <h2>Existing Tickets</h2>
            {oldTickets.map((ticket, index) => (
                <div key={index}>{ticket._id} - {ticket.code} - {ticket.trainnumber} - {ticket.traindate}</div>
            ))}
        </div>
    )
}

export default OldTickets;
