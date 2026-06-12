'use client';

import { useEffect, useRef, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

import { useBuilderContext } from './builder-root';
import { cn } from '@/lib/utils';

const USERNAME_DEBOUNCE_MS = 500;

interface BuilderSidebarProps {
  className?: string;
}

export const BuilderSidebar = ({ className }: BuilderSidebarProps) => {
  const { config, updateConfig } = useBuilderContext();
  const [usernameInput, setUsernameInput] = useState<string>(config.username);
  const usernameTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  useEffect(() => () => clearTimeout(usernameTimerRef.current), []);

  const handleUsernameChange = (value: string) => {
    setUsernameInput(value);
    clearTimeout(usernameTimerRef.current);
    usernameTimerRef.current = setTimeout(() => {
      updateConfig({ username: value });
    }, USERNAME_DEBOUNCE_MS);
  };

  return (
    <div
      className={cn(
        'border-border bg-card w-full space-y-8 border-r p-6 lg:max-h-[calc(100vh-4rem-1px)] lg:w-96 lg:min-w-96 lg:overflow-y-auto',
        className,
      )}
    >
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-foreground text-xl font-semibold">Contributions Builder</h2>
        <p className="text-muted-foreground text-sm">Customize your GitHub contributions widget</p>
      </div>

      {/* Basic Settings */}
      <div className="space-y-6">
        <h3 className="text-foreground text-lg font-medium">Basic Settings</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-foreground text-sm font-medium">
              GitHub Username
            </Label>
            <Input
              id="username"
              placeholder="octocat"
              value={usernameInput}
              onChange={(e) => handleUsernameChange(e.target.value)}
              className="btn-transition border-border bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 focus:ring-2"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium">Year (optional)</Label>
            <Select
              value={config.year?.toString() || 'current'}
              onValueChange={(value) =>
                updateConfig({ year: value === 'current' ? undefined : parseInt(value) })
              }
            >
              <SelectTrigger className="btn-transition border-border bg-input text-foreground focus:border-primary focus:ring-primary/20 focus:ring-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-border bg-card">
                <SelectItem value="current">Last 12 months</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground text-sm font-medium">
              Custom Title (optional)
            </Label>
            <Input
              id="title"
              placeholder="My Contributions"
              value={config.title || ''}
              onChange={(e) => updateConfig({ title: e.target.value || undefined })}
              className="btn-transition border-border bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 focus:ring-2"
            />
          </div>
        </div>
      </div>

      {/* Display Options */}
      <div className="space-y-6">
        <h3 className="text-foreground text-lg font-medium">Display Options</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <Label
              htmlFor="month-labels"
              className="text-foreground cursor-pointer text-sm font-medium"
            >
              Show Month Labels
            </Label>
            <Switch
              id="month-labels"
              checked={config.showMonthLabels}
              onCheckedChange={(checked) => updateConfig({ showMonthLabels: checked })}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <Label
              htmlFor="weekday-labels"
              className="text-foreground cursor-pointer text-sm font-medium"
            >
              Show Weekday Labels
            </Label>
            <Switch
              id="weekday-labels"
              checked={config.showWeekdayLabels}
              onCheckedChange={(checked) => updateConfig({ showWeekdayLabels: checked })}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <Label htmlFor="legend" className="text-foreground cursor-pointer text-sm font-medium">
              Show Legend
            </Label>
            <Switch
              id="legend"
              checked={config.showLegend}
              onCheckedChange={(checked) => updateConfig({ showLegend: checked })}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <Label htmlFor="border" className="text-foreground cursor-pointer text-sm font-medium">
              Show Border
            </Label>
            <Switch
              id="border"
              checked={config.showBorder}
              onCheckedChange={(checked) => updateConfig({ showBorder: checked })}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <Label
              htmlFor="hide-title"
              className="text-foreground cursor-pointer text-sm font-medium"
            >
              Hide Title
            </Label>
            <Switch
              id="hide-title"
              checked={config.hideTitle}
              onCheckedChange={(checked) => updateConfig({ hideTitle: checked })}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <Label
              htmlFor="animations"
              className="text-foreground cursor-pointer text-sm font-medium"
            >
              Enable Animations
            </Label>
            <Switch
              id="animations"
              checked={config.enableAnimations}
              onCheckedChange={(checked) => updateConfig({ enableAnimations: checked })}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="space-y-6">
        <h3 className="text-foreground text-lg font-medium">Advanced Settings</h3>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-foreground text-sm font-medium">
              Cell Size: {config.cellSize || 12}px
            </Label>
            <Slider
              value={[config.cellSize || 12]}
              onValueChange={([value]) => updateConfig({ cellSize: value })}
              min={8}
              max={20}
              step={1}
              className="w-full"
            />
          </div>

          {config.showBorder && (
            <>
              <div className="space-y-3">
                <Label className="text-foreground text-sm font-medium">
                  Border Width: {config.borderWidth || 1}px
                </Label>
                <Slider
                  value={[config.borderWidth || 1]}
                  onValueChange={([value]) => updateConfig({ borderWidth: value })}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-foreground text-sm font-medium">
                  Border Radius: {config.borderRadius || 0}px
                </Label>
                <Slider
                  value={[config.borderRadius || 0]}
                  onValueChange={([value]) => updateConfig({ borderRadius: value })}
                  min={0}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
