export function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(price);
}

// Add this to your format.js file

export const formatRelativeTime = (date) => {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // difference in seconds
  
  if (diff < 60) {
    return "baru saja";
  } else if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `${minutes} menit yang lalu`;
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours} jam yang lalu`;
  } else if (diff < 2592000) {
    const days = Math.floor(diff / 86400);
    return `${days} hari yang lalu`;
  } else if (diff < 31536000) {
    const months = Math.floor(diff / 2592000);
    return `${months} bulan yang lalu`;
  } else {
    const years = Math.floor(diff / 31536000);
    return `${years} tahun yang lalu`;
  }
};