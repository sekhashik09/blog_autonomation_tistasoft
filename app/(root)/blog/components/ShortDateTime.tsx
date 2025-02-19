export default function ShortDateTime({ datetime }: { datetime: string }) {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    };
  
    return <span>{formatDate(datetime)}</span>;
  }
  