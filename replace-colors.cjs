const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const replacements = {
  // Hex colors
  '#0B2F55': '#0D3B5E',
  '#1A4A6E': '#0D3B5E',
  '#0B2B40': '#0D3B5E',
  '#052136': '#0D3B5E',
  '#1A2E35': '#0D3B5E',
  '#3A4F58': '#4B5563',
  '#334155': '#4B5563',
  '#F2F3F5': '#F5F7F6',
  '#F0F7F6': '#F5F7F6',
  '#EEF4F0': '#F5F7F6',
  '#FFF8F0': '#F5F7F6',
  '#F4FAF5': '#F5F7F6',
  '#E8F5E9': '#F5F7F6',
  '#1FA5A9': '#1A9E8F',
  '#008A1E': '#1A9E8F',
  '#007018': '#1A9E8F',
  '#06ae4d': '#1A9E8F',
  '#059642': '#1A9E8F',
  '#047a35': '#1A9E8F',
  '#2E7D32': '#1A9E8F',
  '#A5D6A7': '#1A9E8F',
  '#34A853': '#1A9E8F',
  '#C0392B': '#EF4444',
  '#F27D26': '#F5A623',
  '#e0961d': '#F5A623',
  '#c4841c': '#F5A623',
  '#6B00D7': '#F5A623',
  '#778899': '#9CA3AF',
  
  // Tailwind text colors
  'text-gray-700': 'text-[#4B5563]',
  'text-gray-600': 'text-[#4B5563]',
  'text-gray-500': 'text-[#4B5563]',
  'text-gray-400': 'text-[#9CA3AF]',
  'text-gray-300': 'text-[#E5E7EB]',
  'text-gray-800': 'text-[#0D3B5E]',
  'text-yellow-400': 'text-[#F5A623]',
  'text-green-500': 'text-[#1A9E8F]',
  'text-green-400': 'text-[#1A9E8F]',
  'text-red-500': 'text-[#EF4444]',
  'text-red-400': 'text-[#EF4444]',
  'text-black': 'text-[#0D3B5E]',
  
  // Tailwind bg colors
  'bg-gray-100': 'bg-[#F5F7F6]',
  'bg-gray-200': 'bg-[#E5E7EB]',
  'bg-gray-50': 'bg-[#F5F7F6]',
  'bg-red-50': 'bg-[#EF4444]/10',
  'bg-green-50': 'bg-[#1A9E8F]/10',
  'bg-green-500': 'bg-[#1A9E8F]',
  'bg-red-500': 'bg-[#EF4444]',
  'bg-cyan-100': 'bg-[#1A9E8F]/10',
  'bg-black': 'bg-[#0D3B5E]',
  
  // Tailwind border colors
  'border-gray-100': 'border-[#E5E7EB]',
  'border-gray-200': 'border-[#E5E7EB]',
  'border-gray-300': 'border-[#E5E7EB]',
  
  // Tailwind fill colors
  'fill-yellow-400': 'fill-[#F5A623]',
  
  // RGBA colors
  'rgba\\(0,138,30': 'rgba(26,158,143',
};

for (const [oldColor, newColor] of Object.entries(replacements)) {
  const regex = new RegExp(oldColor, 'g');
  content = content.replace(regex, newColor);
}

fs.writeFileSync('src/App.tsx', content);

