import React, { useState } from "react";
import { Filter } from "lucide-react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { AccessTime, TrendingUp, NewReleases } from "@mui/icons-material";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

// const CATEGORIES = ["DanceTips", "SelfLove", "Events"];
 const CATEGORIES =["Practice Videos", "Challenge Submissions", "Q&A", "Key Information"]

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  currentFilter,
  onFilterChange,
}: CategoryFilterProps) {
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const filterMenuOpen = Boolean(filterMenuAnchor);

  const handleFilterMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
  };

  const handleFilterChange = (filter: string) => {
    onFilterChange(filter);
    setFilterMenuAnchor(null);
  };

  const getFilterDisplayName = () => {
    switch (currentFilter) {
      case "oldNew":
        return "Old to New";
      case "popular":
        return "Popular";
      default:
        return "New to Old";
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-start">
        {/* Scrollable categories */}
        <div
          className="flex-1 overflow-x-auto pr-4"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#CBD5E0 #F1F5F9",
          }}
        >
          <div
            className="flex items-center gap-2 py-2"
            style={{ minWidth: "max-content" }}
          >
            <button
              className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap ${
                selectedCategory === "All"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => onCategoryChange("All")}
            >
              All
            </button>

            {CATEGORIES.map((category) => (
              <button
                key={category}
                className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-gray-700 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => onCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Filter button - aligned with category buttons */}
        <div className="flex-shrink-0 pt-1">
          <button
            className="rounded-full p-3 bg-gray-200 hover:bg-gray-300 flex items-center gap-1"
            onClick={handleFilterMenuOpen}
            aria-haspopup="true"
            aria-expanded={filterMenuOpen ? "true" : "false"}
          >
            <Filter size={18} />
          </button>

          {/* Filter Menu */}
          <Menu
            anchorEl={filterMenuAnchor}
            open={filterMenuOpen}
            onClose={handleFilterMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem
              onClick={() => handleFilterChange("default")}
              selected={currentFilter === "default"}
            >
              <ListItemIcon>
                <NewReleases fontSize="small" />
              </ListItemIcon>
              <ListItemText>New to Old</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => handleFilterChange("oldNew")}
              selected={currentFilter === "oldNew"}
            >
              <ListItemIcon>
                <AccessTime fontSize="small" />
              </ListItemIcon>
              <ListItemText>Old to New</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => handleFilterChange("popular")}
              selected={currentFilter === "popular"}
            >
              <ListItemIcon>
                <TrendingUp fontSize="small" />
              </ListItemIcon>
              <ListItemText>Popular</ListItemText>
            </MenuItem>
          </Menu>
        </div>
      </div>

      {/* Show current filter if not default */}
      {currentFilter !== "default" && (
        <div className="mt-2 text-sm text-gray-600 flex items-center">
          <span>Sorting: {getFilterDisplayName()}</span>
        </div>
      )}
    </div>
  );
}