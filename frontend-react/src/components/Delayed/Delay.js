function Delay({ train }) {
    const advertised = new Date(train.AdvertisedTimeAtLocation);
    const estimated = new Date(train.EstimatedTimeAtLocation);

    const diff = Math.abs(estimated - advertised);

    const delay = Math.floor(diff / (1000 * 60));
    return (
        <div>
            {delay} minutes
        </div>
    )
}

export default Delay;
