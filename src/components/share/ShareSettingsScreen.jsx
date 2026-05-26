import React from 'react';
import { Box, Typography, IconButton, Radio, RadioGroup, FormControlLabel, Select, MenuItem, Checkbox, TextField } from '@mui/material';
import { ChevronLeft, X } from 'lucide-react';

const ShareSettingsScreen = ({ 
  onBack, 
  onClose,
  access,
  onAccessChange,
  permission,
  onPermissionChange,
  passwordRequired,
  onPasswordToggle,
  password,
  onPasswordChange
}) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={onBack} size="small" sx={{ mr: 1, color: '#64748b' }}>
          <ChevronLeft size={20} />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1, color: '#0f172a' }}>
          Share Settings
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: '#64748b' }}>
          <X size={20} />
        </IconButton>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#475569' }}>
          Who Can Access
        </Typography>
        <Select
          fullWidth
          value={access}
          onChange={(e) => onAccessChange(e.target.value)}
          size="small"
          sx={{ borderRadius: '8px', backgroundColor: '#f8fafc' }}
        >
          <MenuItem value="restricted">Restricted</MenuItem>
          <MenuItem value="anyone">Anyone</MenuItem>
        </Select>
        <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#94a3b8' }}>
          {access === 'anyone' ? 
            'Anyone, Even Those Outside Your Organisation, Will Be Able To Access This File' : 
            'Only People added can open with this link'
          }
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#475569' }}>
          What Can They Do
        </Typography>
        <RadioGroup
          value={permission}
          onChange={(e) => onPermissionChange(e.target.value)}
          sx={{ pl: 1 }}
        >
          <FormControlLabel 
            value="view" 
            control={<Radio size="small" />} 
            label={<Typography variant="body2">Can View</Typography>} 
          />
          <FormControlLabel 
            value="edit" 
            control={<Radio size="small" />} 
            label={<Typography variant="body2">Can Edit</Typography>} 
          />
        </RadioGroup>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#475569' }}>
          Additional Security
        </Typography>
        <FormControlLabel
          control={
            <Checkbox 
              checked={passwordRequired} 
              onChange={(e) => onPasswordToggle(e.target.checked)} 
              size="small" 
            />
          }
          label={<Typography variant="body2">Password Required</Typography>}
        />
        <TextField
          disabled={!passwordRequired}
          fullWidth
          placeholder="Enter Password"
          type="password"
          size="small"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          sx={{ 
            mt: 1,
            '& .MuiOutlinedInput-root': { borderRadius: '8px', backgroundColor: passwordRequired ? '#ffffff' : '#f1f5f9' } 
          }}
        />
      </Box>
    </Box>
  );
};

export default ShareSettingsScreen;
