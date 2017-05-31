import epi from "./cal-epi";

describe('epi week', () => {
    it('should calculate epi week', () => {
        expect(epi('2006-12-31')).toEqual({year: 2007, week: 1});
        expect(epi('2007-01-07')).toEqual({year: 2007, week: 2});
        expect(epi('2007-07-01')).toEqual({year: 2007, week: 27});
        expect(epi('2007-07-07')).toEqual({year: 2007, week: 27});
        expect(epi('2007-12-29')).toEqual({year: 2007, week: 52});

        expect(epi('2007-12-30')).toEqual({year: 2008, week: 1});
        expect(epi('2008-01-06')).toEqual({year: 2008, week: 2});
        expect(epi('2008-07-06')).toEqual({year: 2008, week: 28});
        expect(epi('2008-07-12')).toEqual({year: 2008, week: 28});
        expect(epi('2008-12-20')).toEqual({year: 2008, week: 51});
        expect(epi('2008-12-27')).toEqual({year: 2008, week: 52});
        expect(epi('2008-12-28')).toEqual({year: -1, week: -1});

        expect(epi('2009-01-02')).toEqual({year: -1, week: -1});
        expect(epi('2009-01-04')).toEqual({year: 2009, week: 1});
        expect(epi('2009-12-27')).toEqual({year: 2009, week: 52});
        expect(epi('2010-01-02')).toEqual({year: 2009, week: 52});

        expect(epi('2010-01-03')).toEqual({year: 2010, week: 1});
        expect(epi('2010-12-26')).toEqual({year: 2010, week: 52});
        expect(epi('2011-01-01')).toEqual({year: 2010, week: 52});

        expect(epi('2011-01-02')).toEqual({year: 2011, week: 1});
        expect(epi('2011-12-31')).toEqual({year: 2011, week: 52});

        expect(epi('2012-01-01')).toEqual({year: 2012, week: 1});
        expect(epi('2012-12-29')).toEqual({year: 2012, week: 52});

        expect(epi('2012-12-30')).toEqual({year: 2013, week: 1});
        expect(epi('2013-01-05')).toEqual({year: 2013, week: 1});
        expect(epi('2013-12-28')).toEqual({year: 2013, week: 52});

        expect(epi('2013-12-29')).toEqual({year: 2014, week: 1});
        expect(epi('2014-01-04')).toEqual({year: 2014, week: 1});
        expect(epi('2014-12-28')).toEqual({year: -1, week: -1});
        expect(epi('2014-12-31')).toEqual({year: -1, week: -1});

        expect(epi('2015-01-03')).toEqual({year: -1, week: -1});
        expect(epi('2015-01-04')).toEqual({year: 2015, week: 1});
        expect(epi('2015-12-31')).toEqual({year: 2015, week: 52});

        expect(epi('2016-05-05')).toEqual({year: 2016, week: 18});
        expect(epi('2016-11-12')).toEqual({year: 2016, week: 45});
        expect(epi('2016-11-13')).toEqual({year: 2016, week: 46});
        expect(epi('2016-11-14')).toEqual({year: 2016, week: 46});
        expect(epi('2016-01-03')).toEqual({year: 2016, week: 1});
        expect(epi('2016-01-01')).toEqual({year: 2015, week: 52});
    });
});
