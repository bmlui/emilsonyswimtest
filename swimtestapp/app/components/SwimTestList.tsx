import { useState, useEffect } from 'react';
import { SwimTestData } from "../page";

export default function SwimTestList({ data }: { data: SwimTestData[] }) {
    const [sortConfig, setSortConfig] = useState<{ key: keyof SwimTestData, direction: 'ascending' | 'descending' }>({ key: 'lastName', direction: 'ascending' });

    useEffect(() => {
        setSortConfig({ key: 'lastName', direction: 'ascending' });
    }, []);

    const sortedData = [...data];
    if (sortConfig !== null) {
        sortedData.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }

    const requestSort = (key: keyof SwimTestData) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getColorClass = (bandColor: string) => {
        if (!bandColor) {
            return 'bg-gray-100 text-gray-800';
        }
        switch (bandColor.toLowerCase()) {
            case 'green':
                return 'bg-green-100 text-green-800';
            case 'yellow':
                return 'bg-yellow-100 text-yellow-800';
            case 'red':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getSortIndicator = (key: keyof SwimTestData) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? '▲' : '▼';
        }
        return '';
    };

    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white sticky top-0 font-bold">
                <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('firstName')}>
                        First Name {getSortIndicator('firstName')}
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('lastName')}>
                        Last Name {getSortIndicator('lastName')}
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('bandColor')}>
                        Color {getSortIndicator('bandColor')}
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('tester')}>
                        Tester {getSortIndicator('tester')}
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('testDate')}>
                        Test Date {getSortIndicator('testDate')}
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-s">
                {sortedData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="px-3 py-1 ">{item.firstName}</td>
                        <td className="px-3 py-1 ">{item.lastName}</td>
                        <td className={`px-3 py-1 whitespace-nowrap ${getColorClass(item.bandColor)}`}>{item.bandColor}</td>
                        <td className="px-3 py-1 ">{item.tester}</td>
                        <td className="px-3 py-1 whitespace-nowrap">{item.testDate}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}