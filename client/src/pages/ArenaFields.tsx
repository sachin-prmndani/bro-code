import React, { useState } from 'react';
import Banner from '../assets/Banner.png';

const CF_TAGS: string[] = ["2-sat", "binary search", "bitmasks", "brute force", /* ... rest of your tags */];

// Define props interface for TypeScript
interface ArenaFieldsProps {
  arenaName: string;
}

function ArenaFields({ arenaName }: ArenaFieldsProps) {
  // Use state to keep track of selected tags
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Get all selected options from the multi-select
    const options = e.target.options;
    const selected: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedTags(selected);
  };

  return (
    <div>
      <div className='banner' style={{ position: 'fixed', top: 0, left: 0, zIndex: 1000, width: '100%' }}>
        <img src={Banner} alt="Banner" style={{ width: '100%', height: '180px', display: 'block' }} />
      </div>

      {/* Spacing to prevent content from hiding under fixed banner */}
      <div style={{ marginTop: '200px' }}>
        <div className='Head'>
          <h2>{arenaName}</h2>
        </div>

        <div className='arenaForm'>
          <form onSubmit={(e) => e.preventDefault()}>
            <label>Player 1: <input type="text" /></label>
            <br />
            <label>Player 2: <input type="text" /></label>
            
            <h3>Problem Rating</h3>
            <input type="number" placeholder="Min" name='leftRange' />
            <input type="number" placeholder="Max" name='rightRange' />

            <h3>Select Tags (Hold Ctrl/Cmd to select multiple)</h3>
            <select 
              multiple 
              name="cfTags" 
              id="cfTags" 
              value={selectedTags} 
              onChange={handleTagChange}
              style={{ minHeight: '150px', width: '200px' }}
            >
              {CF_TAGS.map((tag) => (
                <option value={tag} key={tag}>
                  {tag}
                </option>
              ))}
            </select>

            {/* Displaying selected tags below */}
            <div style={{ marginTop: '10px' }}>
              <strong>Selected:</strong> {selectedTags.join(', ') || 'None'}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ArenaFields;
