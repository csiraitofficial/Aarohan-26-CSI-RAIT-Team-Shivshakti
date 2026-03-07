export const createTicket = (req, res) => {
    const { category, urgency, subject, description, attachment } = req.body;
    
    console.log("=== NEW SUPPORT TICKET RECEIVED ===");
    console.log("Category:", category);
    console.log("Urgency:", urgency);
    console.log("Subject:", subject);
    console.log("Description:", description);
    console.log("Attachment Name:", attachment ? attachment.name : "None");
    console.log("Timestamp:", new Date().toLocaleString());
    console.log("====================================");

    res.status(201).json({
        success: true,
        message: "Ticket submitted successfully!",
        ticketId: `TICK-${Math.floor(Math.random() * 10000)}`
    });
};
