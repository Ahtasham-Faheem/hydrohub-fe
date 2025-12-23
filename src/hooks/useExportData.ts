import { useCallback } from 'react';
import type { CatalogueItem } from '../types/catalogue';

export const useExportData = () => {
  const downloadFile = useCallback((filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const exportToJSON = useCallback((items: CatalogueItem[]) => {
    const json = JSON.stringify(items, null, 2);
    downloadFile("catalogue.json", json, "application/json");
  }, [downloadFile]);

  const exportToCSV = useCallback((items: CatalogueItem[]) => {
    if (!items.length) return;
    
    const headers = [
      "Name",
      "Category", 
      "SKU",
      "Selling Price",
      "Sale Price",
      "Stock",
      "Status",
    ];
    
    const rows = items.map((item) => [
      item.name,
      typeof item.category === 'object' ? item.category?.name || '' : item.category || '',
      item.sku || "",
      item.sellingPrice,
      item.salePrice,
      item.currentStock,
      item.status,
    ]);
    
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
      
    downloadFile("catalogue.csv", csv, "text/csv");
  }, [downloadFile]);

  return {
    exportToJSON,
    exportToCSV,
  };
};